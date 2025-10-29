const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'asispoch',
  password: 'admin',
  port: 5432,
});

// Verificar conexión a la base de datos al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('✅ Conectado a PostgreSQL - Base de datos: asispoch');
    release();
  }
});

// Middleware para logging de todas las requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, req.body || '');
  next();
});

// Rutas de la API
app.get('/api/incidents', async (req, res) => {
  try {
    console.log('🔍 Obteniendo incidentes de la base de datos...');
    const result = await pool.query(`
      SELECT * FROM incidents 
      ORDER BY reported_at DESC
    `);
    
    console.log(`✅ Se encontraron ${result.rows.length} incidentes en la BD`);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo incidentes:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/incidents', async (req, res) => {
  try {
    console.log('📝 Intentando crear incidente en la base de datos...');
    console.log('📦 Datos recibidos:', JSON.stringify(req.body, null, 2));

    const {
      title,
      description,
      incidentTypes,
      severity,
      location,
      accessibilityFeatures,
      contactInfo,
      urgencyLevel,
      estimatedImpact,
      routeImpact,
      affectedUsers
    } = req.body;

    // Verificar datos mínimos requeridos
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Título y descripción son requeridos'
      });
    }

    const result = await pool.query(
      `INSERT INTO incidents (
        title, description, incident_types, severity, 
        location_building, location_area, location_description,
        location_nearby_landmark, accessibility_features,
        reporter_full_name, reporter_email, reporter_phone,
        reporter_id_number, reporter_affiliation, notification_methods,
        update_frequency, allow_direct_contact, share_with_security,
        anonymous_report, contact_start_time, contact_end_time,
        contact_comments, urgency_level, estimated_impact,
        route_impact, affected_users, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, 'active')
      RETURNING *`,
      [
        title,
        description,
        incidentTypes,
        severity,
        location?.building,
        location?.area,
        location?.description,
        location?.nearbyLandmark,
        accessibilityFeatures,
        contactInfo?.fullName,
        contactInfo?.email,
        contactInfo?.phone,
        contactInfo?.idNumber,
        contactInfo?.affiliation,
        contactInfo?.notificationMethods,
        contactInfo?.updateFrequency,
        contactInfo?.allowDirectContact,
        contactInfo?.shareWithSecurity,
        contactInfo?.anonymousReport,
        contactInfo?.contactStartTime,
        contactInfo?.contactEndTime,
        contactInfo?.contactComments,
        urgencyLevel,
        estimatedImpact,
        routeImpact,
        affectedUsers || 1
      ]
    );

    const newIncident = result.rows[0];
    console.log('✅ Incidente creado exitosamente en la BD:');
    console.log('📋 ID:', newIncident.id);
    console.log('📋 Tracking Number:', newIncident.tracking_number);
    console.log('📋 Título:', newIncident.title);
    console.log('📋 Estado:', newIncident.status);

    res.json({
      success: true,
      data: newIncident,
      message: 'Incidente reportado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error creando incidente en la BD:', error.message);
    console.error('🔧 Detalles del error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al crear el incidente en la base de datos'
    });
  }
});

// Nueva ruta para verificar estado de la base de datos
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    const dbResult = await pool.query('SELECT NOW() as time, version() as version');
    const incidentsCount = await pool.query('SELECT COUNT(*) FROM incidents');
    
    console.log('🏥 Health check - BD conectada');
    
    res.json({
      success: true,
      database: {
        connected: true,
        time: dbResult.rows[0].time,
        version: dbResult.rows[0].version,
        incidents_count: parseInt(incidentsCount.rows[0].count)
      },
      server: {
        status: 'running',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    res.status(500).json({
      success: false,
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

// Ruta para ver todos los incidentes en la BD
app.get('/api/debug/incidents', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        tracking_number,
        title,
        status,
        severity,
        reporter_full_name,
        reporter_email,
        location_building,
        reported_at,
        created_at
      FROM incidents 
      ORDER BY created_at DESC
    `);
    
    console.log(`🔍 Debug: Mostrando ${result.rows.length} incidentes de la BD`);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error en debug endpoint:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.put('/api/incidents/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`🔄 Actualizando estado del incidente ${id} a: ${status}`);

    const result = await pool.query(
      'UPDATE incidents SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Incidente no encontrado'
      });
    }

    console.log(`✅ Estado actualizado: ${id} -> ${status}`);
    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'Estado actualizado correctamente' 
    });
  } catch (error) {
    console.error('❌ Error actualizando estado:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.put('/api/incidents/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    console.log(`👤 Asignando incidente ${id} a: ${assignedTo}`);

    const result = await pool.query(
      'UPDATE incidents SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [assignedTo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Incidente no encontrado'
      });
    }

    console.log(`✅ Incidente asignado: ${id} -> ${assignedTo}`);
    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'Incidente asignado correctamente' 
    });
  } catch (error) {
    console.error('❌ Error asignando incidente:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/incidents/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { commentText, createdBy } = req.body;

    console.log(`💬 Agregando comentario al incidente ${id}`);

    const result = await pool.query(
      'INSERT INTO incident_comments (incident_id, comment_text, created_by) VALUES ($1, $2, $3) RETURNING *',
      [id, commentText, createdBy]
    );

    console.log(`✅ Comentario agregado al incidente ${id}`);
    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'Comentario agregado correctamente' 
    });
  } catch (error) {
    console.error('❌ Error agregando comentario:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Debug: http://localhost:${PORT}/api/debug/incidents`);
});