const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Configuración JWT (en producción usa variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura_espoch_2025';


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
    console.error('Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('Conectado a PostgreSQL - Base de datos: asispoch');
    release();
  }
});

// Middleware para logging de todas las requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, req.body || '');
  next();
});

// =============================================
// RUTAS PARA INCIDENTES
// =============================================

// Rutas de la API (broker)
app.get('/api/incidents', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.*,
        COUNT(va.id) as current_volunteers,
        i.volunteers_needed,
        -- Obtener información del voluntario asignado (nombre)
        v.name as assigned_volunteer_name,
        i.assigned_to as assigned_volunteer_email,
        CASE 
          WHEN i.assigned_to IS NOT NULL THEN 'Asignado'
          ELSE 'No asignado'
        END as assignment_status
      FROM incidents i
      LEFT JOIN volunteer_assignments va ON i.id = va.incident_id 
        AND va.status IN ('assigned', 'in_progress')
      LEFT JOIN volunteers v ON i.assigned_to = v.email  -- Unir para obtener nombre
      GROUP BY i.id, v.name, v.email
      ORDER BY i.reported_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/incidents', async (req, res) => {
  try {
    console.log('Intentando crear incidente en la base de datos...');
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));

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
    console.log('Incidente creado exitosamente en la BD:');
    console.log('ID:', newIncident.id);
    console.log('Tracking Number:', newIncident.tracking_number);
    console.log('Título:', newIncident.title);
    console.log('Estado:', newIncident.status);

    res.json({
      success: true,
      data: newIncident,
      message: 'Incidente reportado exitosamente'
    });

  } catch (error) {
    console.error('Error creando incidente en la BD:', error.message);
    console.error('Detalles del error:', error);
    
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
    
    console.log('Health check - BD conectada');
    
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
    console.error('Health check failed:', error.message);
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
app.get('/api/incidents', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.*,
        COUNT(va.id) as current_volunteers,
        i.volunteers_needed,
        -- Incluir información del voluntario asignado
        CASE 
          WHEN i.assigned_to IS NOT NULL THEN i.assigned_to
          ELSE 'No asignado'
        END as assignment_status
      FROM incidents i
      LEFT JOIN volunteer_assignments va ON i.id = va.incident_id 
        AND va.status IN ('assigned', 'in_progress')
      GROUP BY i.id
      ORDER BY i.reported_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/incidents/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Actualizando estado del incidente ${id} a: ${status}`);

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

    console.log(`Estado actualizado: ${id} -> ${status}`);
    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'Estado actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error actualizando estado:', error.message);
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

    console.log(`Asignando incidente ${id} a: ${assignedTo}`);

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

    console.log(`Incidente asignado: ${id} -> ${assignedTo}`);
    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'Incidente asignado correctamente' 
    });
  } catch (error) {
    console.error('Error asignando incidente:', error.message);
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

    console.log(`Agregando comentario al incidente ${id}`);

    const result = await pool.query(
      'INSERT INTO incident_comments (incident_id, comment_text, created_by) VALUES ($1, $2, $3) RETURNING *',
      [id, commentText, createdBy]
    );

    console.log(`Comentario agregado al incidente ${id}`);
    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'Comentario agregado correctamente' 
    });
  } catch (error) {
    console.error('Error agregando comentario:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ruta para ver detalles de asignaciones de un incidente específico
app.get('/api/incidents/:id/volunteer-assignments', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        va.*,
        v.name as volunteer_name,
        v.phone as volunteer_phone,
        v.skills as volunteer_skills
      FROM volunteer_assignments va
      LEFT JOIN volunteers v ON va.volunteer_email = v.email
      WHERE va.incident_id = $1
      ORDER BY va.assigned_at DESC
    `, [id]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo asignaciones:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =============================================
// RUTAS PARA LOGIN
// =============================================

// Ruta de login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔐 Intentando login para: ${email}`);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario en la base de datos
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }

    const user = userResult.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }

    // Actualizar último login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.user_type,
        fullName: user.full_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Login exitoso para: ${user.email} (${user.user_type})`);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          userType: user.user_type
        }
      },
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Ruta para verificar token (proteger rutas)
app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      success: true,
      data: {
        user: decoded
      }
    });

  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
});

// Middleware para proteger rutas
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Ejemplo de ruta protegida
app.get('/api/protected-route', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: `Hola ${req.user.fullName}, tienes acceso a esta ruta protegida`
  });
});

// =============================================
// RUTAS PARA VOLUNTARIOS
// =============================================

// Registro de voluntarios
app.post('/api/volunteers/register', async (req, res) => {
  try {
    console.log('📝 Registrando nuevo voluntario...');
    const {
      name,
      email,
      phone,
      skills,
      availability,
      areas_of_interest,
      experience_level
    } = req.body;

    // Verificar datos requeridos
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Nombre y email son requeridos'
      });
    }

    // Verificar si el voluntario ya existe
    const existingVolunteer = await pool.query(
      'SELECT * FROM volunteers WHERE email = $1',
      [email]
    );

    if (existingVolunteer.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un voluntario registrado con este email'
      });
    }

    // Insertar nuevo voluntario
    const result = await pool.query(
      `INSERT INTO volunteers (
        name, email, phone, skills, availability, 
        areas_of_interest, experience_level, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
      RETURNING *`,
      [
        name,
        email,
        phone,
        JSON.stringify(skills || []),
        availability,
        JSON.stringify(areas_of_interest || []),
        experience_level || 'beginner'
      ]
    );

    const newVolunteer = result.rows[0];
    console.log(`✅ Voluntario registrado: ${newVolunteer.name} (ID: ${newVolunteer.id})`);

    res.json({
      success: true,
      data: newVolunteer,
      message: 'Registro de voluntario exitoso'
    });

  } catch (error) {
    console.error('❌ Error registrando voluntario:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener perfil del voluntario
app.get('/api/volunteers/profile', async (req, res) => {
  try {
    // En una implementación real, esto vendría del token JWT
    const volunteerEmail = req.query.email || 'volunteer@espoch.edu.ec'; // Temporal para pruebas
    
    console.log(`👤 Obteniendo perfil del voluntario: ${volunteerEmail}`);

    const result = await pool.query(
      `SELECT 
        id, name, email, phone, skills, availability,
        areas_of_interest, experience_level, status,
        created_at, total_assignments, completed_assignments
       FROM volunteers 
       WHERE email = $1`,
      [volunteerEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Voluntario no encontrado'
      });
    }

    const volunteer = result.rows[0];
    console.log(`✅ Perfil cargado: ${volunteer.name}`);

    res.json({
      success: true,
      data: volunteer
    });

  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener incidentes disponibles para voluntarios
app.get('/api/volunteers/incidents', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    console.log(`🔍 Obteniendo incidentes para voluntario: ${userEmail}`);

    const result = await pool.query(`
      SELECT 
        i.*,
        COUNT(va.id) as current_volunteers,
        -- Verificar si el voluntario actual está asignado (por EMAIL)
        CASE 
          WHEN i.assigned_to = $1 THEN true
          ELSE false
        END as assigned_to_me,
        -- Obtener el nombre del voluntario asignado si existe
        v_assigned.name as assigned_volunteer_name
      FROM incidents i
      LEFT JOIN volunteer_assignments va ON i.id = va.incident_id 
        AND va.status IN ('assigned', 'in_progress')
      LEFT JOIN volunteers v_assigned ON i.assigned_to = v_assigned.email
      WHERE i.assignable = true 
        AND i.status IN ('active', 'in-progress')
      GROUP BY i.id, v_assigned.name, v_assigned.email
      ORDER BY i.severity DESC, i.reported_at DESC
    `, [userEmail]);

    console.log(`✅ ${result.rows.length} incidentes disponibles para ${userEmail}`);
    
    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('❌ Error obteniendo incidentes para voluntarios:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Asignar voluntario a un incidente
app.post('/api/volunteers/incidents/:incidentId/assign', authenticateToken, async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { volunteerEmail, volunteerName } = req.body;

    console.log(`🤝 Asignando voluntario ${volunteerEmail} al incidente ${incidentId}`);

    // Verificar si el incidente existe
    const incidentResult = await pool.query(
      'SELECT * FROM incidents WHERE id = $1',
      [incidentId]
    );

    if (incidentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Incidente no encontrado'
      });
    }

    // Guardar el EMAIL en assigned_to (no el nombre)
    await pool.query(
      'UPDATE incidents SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [volunteerEmail, incidentId]  // ← Guardar email, no nombre
    );

    console.log(`✅ Voluntario asignado al incidente ${incidentId} - Email guardado en assigned_to`);

    res.json({
      success: true,
      data: { incident_id: incidentId, assigned_to: volunteerEmail },
      message: 'Te has asignado al incidente exitosamente'
    });

  } catch (error) {
    console.error('❌ Error asignando voluntario:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Liberar voluntario de un incidente
app.post('/api/volunteers/incidents/:incidentId/unassign', authenticateToken, async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { volunteerEmail } = req.body;

    console.log(`🔄 Liberando voluntario del incidente ${incidentId}`);

    // SIMPLIFICADO: Siempre limpiar assigned_to cuando un voluntario se libera
    await pool.query(
      'UPDATE incidents SET assigned_to = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [incidentId]
    );

    const result = await pool.query(
      `UPDATE volunteer_assignments 
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP
       WHERE incident_id = $1 AND volunteer_email = $2 
       AND status IN ('assigned', 'in_progress')
       RETURNING *`,
      [incidentId, volunteerEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró una asignación activa para este incidente'
      });
    }

    console.log(`✅ Voluntario liberado del incidente ${incidentId}`);

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Te has liberado del incidente exitosamente'
    });

  } catch (error) {
    console.error('❌ Error liberando voluntario:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener asignaciones del voluntario
app.get('/api/volunteers/assignments', authenticateToken, async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email de voluntario es requerido'
      });
    }

    console.log(`📋 Obteniendo asignaciones del voluntario: ${email}`);

    // Obtener el nombre del voluntario desde la tabla volunteers
    const volunteerResult = await pool.query(
      'SELECT name FROM volunteers WHERE email = $1',
      [email]
    );

    let volunteerName = null;
    if (volunteerResult.rows.length > 0) {
      volunteerName = volunteerResult.rows[0].name;
    }

    // Buscar en assigned_to de incidents usando el EMAIL (no el nombre)
    const result = await pool.query(
      `SELECT 
        i.id as incident_id,
        i.title,
        i.description,
        i.severity,
        i.status as incident_status,
        i.location_building,
        i.reported_at,
        i.assigned_to,
        'assigned' as status,
        i.updated_at as assigned_at,
        v.name as volunteer_name  -- Obtener el nombre del voluntario
       FROM incidents i
       LEFT JOIN volunteers v ON i.assigned_to = v.email  -- Unir por email
       WHERE i.assigned_to = $1
       AND i.status IN ('active', 'in-progress')
       ORDER BY i.reported_at DESC`,
      [email]  // Buscar por email, no por nombre
    );

    console.log(`✅ ${result.rows.length} asignaciones encontradas para ${email}`);

    // Formatear respuesta
    const assignments = result.rows.map(incident => ({
      id: `incident_${incident.incident_id}`,
      incident_id: incident.incident_id,
      volunteer_email: email,
      volunteer_name: incident.volunteer_name || volunteerName,  // Usar el nombre de la unión o el de la consulta anterior
      status: 'assigned',
      assigned_at: incident.assigned_at,
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      incident_status: incident.incident_status,
      location_building: incident.location_building,
      reported_at: incident.reported_at
    }));

    res.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    console.error('❌ Error obteniendo asignaciones:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Actualizar estado de una asignación
app.put('/api/volunteers/assignments/:assignmentId/status', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { status, volunteerEmail, volunteerName } = req.body;

    console.log(`🔄 Actualizando estado de asignación ${assignmentId} a: ${status}`);

    const validStatuses = ['assigned', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado inválido'
      });
    }

    // DETERMINAR si es una asignación de assigned_to o de volunteer_assignments
    if (assignmentId.startsWith('assigned_to_')) {
      // Es una asignación desde assigned_to de incidents
      const incidentId = assignmentId.replace('assigned_to_', '');
      
      if (status === 'completed' || status === 'cancelled') {
        // Liberar al voluntario - limpiar assigned_to
        await pool.query(
          'UPDATE incidents SET assigned_to = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
          [incidentId]
        );
        
        console.log(`✅ Asignación desde assigned_to liberada: incidente ${incidentId}`);
        
        res.json({
          success: true,
          data: {
            id: assignmentId,
            incident_id: parseInt(incidentId),
            status: status,
            updated_at: new Date().toISOString()
          },
          message: 'Estado actualizado correctamente'
        });
      } else {
        // Para otros estados, no hacemos nada en assigned_to
        res.json({
          success: true,
          data: {
            id: assignmentId,
            incident_id: parseInt(incidentId),
            status: status,
            updated_at: new Date().toISOString()
          },
          message: 'Estado actualizado correctamente'
        });
      }
      
    } else {
      // Es una asignación normal de volunteer_assignments
      const result = await pool.query(
        `UPDATE volunteer_assignments 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 
         RETURNING *`,
        [status, assignmentId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Asignación no encontrada'
        });
      }

      console.log(`✅ Estado de asignación actualizado: ${assignmentId} -> ${status}`);

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Estado actualizado correctamente'
      });
    }

  } catch (error) {
    console.error('❌ Error actualizando estado de asignación:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Agregar comentario como voluntario
app.post('/api/volunteers/incidents/:incidentId/comments', async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { commentText, authorName } = req.body;

    console.log(`💬 Agregando comentario de voluntario al incidente ${incidentId}`);

    const result = await pool.query(
      `INSERT INTO incident_comments (
        incident_id, comment_text, created_by, author_role
      ) VALUES ($1, $2, $3, 'volunteer')
      RETURNING *`,
      [incidentId, commentText, authorName || 'Voluntario']
    );

    console.log(`✅ Comentario de voluntario agregado al incidente ${incidentId}`);

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

// Obtener estadísticas de voluntarios
app.get('/api/volunteers/stats', async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas de voluntarios...');

    // Estadísticas básicas de la tabla volunteers
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_volunteers,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_volunteers,
        COALESCE(SUM(total_assignments), 0) as total_assignments,
        COALESCE(SUM(completed_assignments), 0) as completed_assignments
      FROM volunteers
    `);

    // Estadísticas de asignaciones activas desde assigned_to
    const activeAssignmentsResult = await pool.query(`
      SELECT 
        COUNT(*) as active_assignments_from_incidents
      FROM incidents 
      WHERE assigned_to IS NOT NULL 
      AND status IN ('active', 'in-progress')
    `);

    // Top voluntarios basado en completed_assignments
    const topVolunteersResult = await pool.query(`
      SELECT name, completed_assignments, total_assignments
      FROM volunteers 
      WHERE status = 'active'
      ORDER BY completed_assignments DESC 
      LIMIT 5
    `);

    // Combinar estadísticas
    const overview = {
      ...statsResult.rows[0],
      active_assignments_from_incidents: parseInt(activeAssignmentsResult.rows[0].active_assignments_from_incidents),
      total_active_assignments: parseInt(statsResult.rows[0].total_assignments) + parseInt(activeAssignmentsResult.rows[0].active_assignments_from_incidents)
    };

    res.json({
      success: true,
      data: {
        overview: overview,
        top_volunteers: topVolunteersResult.rows
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ruta para sincronizar asignaciones entre assigned_to y volunteer_assignments
app.post('/api/volunteers/sync-assignments', async (req, res) => {
  try {
    console.log('🔄 Sincronizando asignaciones de voluntarios...');

    // Encontrar incidentes con assigned_to pero sin registro en volunteer_assignments
    const unsyncedIncidents = await pool.query(`
      SELECT i.id, i.assigned_to, i.title
      FROM incidents i
      WHERE i.assigned_to IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM volunteer_assignments va 
        WHERE va.incident_id = i.id 
        AND va.status IN ('assigned', 'in_progress')
      )
    `);

    console.log(`📝 ${unsyncedIncidents.rows.length} asignaciones por sincronizar`);

    // Sincronizar cada una
    for (const incident of unsyncedIncidents.rows) {
      // Buscar el email del voluntario por nombre
      const volunteerResult = await pool.query(
        'SELECT email FROM volunteers WHERE name = $1 LIMIT 1',
        [incident.assigned_to]
      );

      if (volunteerResult.rows.length > 0) {
        const volunteerEmail = volunteerResult.rows[0].email;
        
        // Crear registro en volunteer_assignments
        await pool.query(
          `INSERT INTO volunteer_assignments (
            incident_id, volunteer_email, status
          ) VALUES ($1, $2, 'assigned')`,
          [incident.id, volunteerEmail]
        );
        
        console.log(`✅ Sincronizado: ${incident.assigned_to} -> ${incident.title}`);
      } else {
        console.log(`⚠️ Voluntario no encontrado: ${incident.assigned_to}`);
      }
    }

    res.json({
      success: true,
      message: `Sincronización completada. ${unsyncedIncidents.rows.length} asignaciones procesadas.`
    });

  } catch (error) {
    console.error('❌ Error sincronizando asignaciones:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ruta para obtener todos los voluntarios activos
app.get('/api/volunteers', async (req, res) => {
  try {
    console.log('👥 Obteniendo lista de voluntarios activos...');
    
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        skills,
        availability,
        experience_level,
        status,
        total_assignments,
        completed_assignments
      FROM volunteers 
      WHERE status = 'active'
      ORDER BY name ASC
    `);
    
    console.log(`✅ ${result.rows.length} voluntarios encontrados`);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo voluntarios:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Debug: http://localhost:${PORT}/api/debug/incidents`);
});