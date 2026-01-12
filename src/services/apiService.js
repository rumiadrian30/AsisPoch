const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Verificar si el backend está disponible
let backendAvailable = true;

// Variable para almacenar el token
let authToken = localStorage.getItem('authToken') || null;

// Función para verificar la disponibilidad del backend
const checkBackendAvailability = async () => {
  try {
    console.log('Verificando disponibilidad del backend...');
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    backendAvailable = response.ok;
    console.log(backendAvailable ? 'Backend disponible' : 'Backend no disponible');
  } catch (error) {
    backendAvailable = false;
    console.log('Backend no disponible, usando modo simulación');
  }
};

// Verificar al cargar
checkBackendAvailability();

// Servicio de simulación
const SimulationService = {
  createIncident: (incidentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trackingNumber = `INC-${Date.now().toString().slice(-6)}`;
        resolve({
          success: true,
          data: {
            id: Math.floor(Math.random() * 1000),
            ...incidentData,
            trackingNumber,
            status: 'active',
            reportedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          message: 'Incidente reportado exitosamente (modo simulación)'
        });
      }, 1000);
    });
  },

  updateIncidentStatus: (id, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `Estado actualizado a ${status} (simulación)` 
        });
      }, 500);
    });
  },

  assignIncident: (id, assignedTo) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `Incidente asignado a ${assignedTo} (simulación)` 
        });
      }, 500);
    });
  },

  addComment: (incidentId, commentText, createdBy) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Comentario agregado (simulación)' 
        });
      }, 500);
    });
  },

  getAllIncidents: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          data: [] 
        });
      }, 500);
    });
  },

  // Nuevas funciones para administrador
  getAdminIncidents: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          data: [] 
        });
      }, 500);
    });
  },

  getIncidentVolunteerAssignments: (incidentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 1,
              incident_id: incidentId,
              volunteer_email: 'volunteer@espoch.edu.ec',
              volunteer_name: 'Voluntario Ejemplo',
              status: 'assigned',
              assigned_at: new Date().toISOString()
            }
          ]
        });
      }, 500);
    });
  },

  // Nuevas funciones para voluntarios
  registerVolunteer: (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: Math.floor(Math.random() * 1000),
            ...profileData,
            status: 'active',
            total_assignments: 0,
            completed_assignments: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          message: 'Voluntario registrado exitosamente (modo simulación)'
        });
      }, 1000);
    });
  },

  getVolunteerProfile: (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular que no hay perfil para forzar registro
        resolve({ 
          success: false, 
          error: 'Voluntario no encontrado' 
        });
      }, 500);
    });
  },

  getIncidentsForVolunteers: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockIncidents = [
          {
            id: 1,
            title: 'Rampa de acceso bloqueada en Edificio A',
            description: 'La rampa principal de acceso para sillas de ruedas está obstruida por trabajos de construcción.',
            severity: 'critical',
            status: 'active',
            location_building: 'Edificio A',
            reporter_full_name: 'Rumi Grefa',
            reported_at: new Date().toISOString(),
            affected_users: 15,
            route_impact: 'major',
            estimated_resolution: '4-6 horas',
            assignable: true,
            volunteers_needed: 2,
            current_volunteers: 0,
            assigned_to_me: false
          },
          {
            id: 2,
            title: 'Ayuda para movilización entre edificios',
            description: 'Estudiante requiere asistencia para moverse del Edificio B al Edificio F',
            severity: 'medium',
            status: 'active',
            location_building: 'Edificio B',
            reporter_full_name: 'Carlos Pérez',
            reported_at: new Date().toISOString(),
            affected_users: 1,
            route_impact: 'minor',
            estimated_resolution: '30 minutos',
            assignable: true,
            volunteers_needed: 1,
            current_volunteers: 0,
            assigned_to_me: false
          },
          {
            id: 3,
            title: 'Ascensor fuera de servicio en Biblioteca',
            description: 'El ascensor principal de la biblioteca no funciona, afectando a usuarios con movilidad reducida',
            severity: 'high',
            status: 'in-progress',
            location_building: 'Biblioteca Central',
            reporter_full_name: 'Ana López',
            reported_at: new Date().toISOString(),
            affected_users: 8,
            route_impact: 'major',
            estimated_resolution: '2-3 horas',
            assignable: true,
            volunteers_needed: 1,
            current_volunteers: 1,
            assigned_to_me: false
          }
        ];
        console.log('🎭 Devolviendo incidentes de simulación para voluntarios');
        resolve({ 
          success: true, 
          data: mockIncidents 
        });
      }, 1000);
    });
  },

  assignVolunteerToIncident: (incidentId, volunteerEmail, volunteerName = null) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: Math.floor(Math.random() * 1000),
            incident_id: incidentId,
            volunteer_email: volunteerEmail,
            volunteer_name: volunteerName,
            status: 'assigned',
            assigned_at: new Date().toISOString()
          },
          message: 'Te has asignado al incidente exitosamente (simulación)'
        });
      }, 500);
    });
  },

  unassignVolunteerFromIncident: (incidentId, volunteerEmail) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            incident_id: incidentId,
            volunteer_email: volunteerEmail,
            status: 'completed'
          },
          message: 'Te has liberado del incidente exitosamente (simulación)'
        });
      }, 500);
    });
  },

  getMyAssignments: (volunteerEmail) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 1,
              incident_id: 3,
              volunteer_email: volunteerEmail,
              status: 'assigned',
              assigned_at: new Date().toISOString(),
              title: 'Ascensor fuera de servicio en Biblioteca',
              description: 'El ascensor principal de la biblioteca no funciona',
              severity: 'high',
              incident_status: 'in-progress',
              location_building: 'Biblioteca Central',
              reported_at: new Date().toISOString()
            }
          ]
        });
      }, 500);
    });
  },

  addVolunteerComment: (incidentId, commentText, authorName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Comentario agregado (simulación)' 
        });
      }, 500);
    });
  },

  updateVolunteerProfile: (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            ...profileData,
            updated_at: new Date().toISOString()
          },
          message: 'Perfil actualizado (simulación)'
        });
      }, 500);
    });
  },

  getVolunteerStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            overview: {
              total_volunteers: 15,
              active_volunteers: 12,
              total_assignments: 45,
              completed_assignments: 38
            },
            top_volunteers: [
              { name: 'María González', completed_assignments: 8, total_assignments: 8 },
              { name: 'Carlos Ruiz', completed_assignments: 6, total_assignments: 7 },
              { name: 'Ana Torres', completed_assignments: 5, total_assignments: 5 }
            ]
          }
        });
      }, 500);
    });
  },

  // Simulación actualizada para login con base de datos real
  login: (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulación de respuesta del backend real
        // En la realidad, esto vendría de la base de datos espoch_mobility.users
        resolve({
          success: true,
          data: {
            token: 'mock_jwt_token_' + Date.now(),
            user: {
              userId: 1,
              email: email,
              fullName: 'Usuario ' + email.split('@')[0],
              userType: email.includes('voluntario') ? 'volunteer' : 
                       email.includes('admin') ? 'admin' : 
                       email.includes('personal') ? 'staff' : 'student'
            }
          },
          message: 'Login exitoso (simulación)'
        });
      }, 1000);
    });
  },

  verifyToken: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            user: {
              userId: 1,
              email: 'usuario@espoch.edu.ec',
              userType: 'student',
              fullName: 'Usuario Ejemplo'
            }
          }
        });
      }, 500);
    });
  }
};

// =============================================
// FUNCIONES PARA LOGIN
// =============================================

// Función para guardar el token
const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

// Función para limpiar el token
const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

// apiRequest
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 Intentando petición real a:', url);
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Agregar token de autenticación si existe - REQUERIDO para endpoints protegidos
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      headers,
      ...options,
      signal: AbortSignal.timeout(8000) // Timeout aumentado para login
    });

    // Si la petición fue exitosa, marcar backend como disponible
    if (response.ok) {
      backendAvailable = true;
      console.log('✅ Petición real exitosa');
    }

    // Si recibimos 401 (Unauthorized), limpiar el token
    if (response.status === 401) {
      clearAuthToken();
      throw new Error('Sesión expirada');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error HTTP:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Petición real falló:', error.message);
    
    // Solo marcar como no disponible si es error de conexión
    if (error.name === 'TimeoutError' || error.message.includes('Failed to fetch')) {
      backendAvailable = false;
      console.log('🔧 Cambiando a modo simulación');
      throw new Error('MODO_SIMULACION');
    }
    
    // Para otros errores (como 404, 500, etc.), re-lanzar el error
    throw error;
  }
};

// Funciones de autenticación para BD
export const AuthService = {
  async login(email, password) {
    try {
      console.log('🔐 Intentando login real con:', email);
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (result.success && result.data.token) {
        setAuthToken(result.data.token);
        console.log('✅ Login real exitoso, token guardado');
      } else {
        console.log('❌ Login real falló:', result.message);
      }

      return result;
    } catch (error) {
      // Simulación para desarrollo cuando el backend no está disponible
      if (error.message === 'MODO_SIMULACION') {
        console.log('🔧 Usando simulación para login');
        return await SimulationService.login(email, password);
      }
      console.error('❌ Error en login:', error);
      throw error;
    }
  },

  async verifyToken() {
    try {
      if (!authToken) {
        throw new Error('No hay token disponible');
      }
      
      console.log('🔍 Verificando token real...');
      const result = await apiRequest('/auth/verify');
      console.log('✅ Token verificado correctamente');
      return result;
    } catch (error) {
      if (error.message === 'MODO_SIMULACION') {
        console.log('🔧 Usando simulación para verifyToken');
        return await SimulationService.verifyToken();
      }
      console.error('❌ Error verificando token:', error);
      
      // Si hay error de verificación, limpiar el token
      if (error.message.includes('Sesión expirada') || error.message.includes('401')) {
        clearAuthToken();
      }
      
      throw error;
    }
  },

  logout() {
    console.log('🚪 Cerrando sesión...');
    clearAuthToken();
  },

  getToken() {
    return authToken;
  },

  isAuthenticated() {
    return !!authToken;
  },

  // Nueva función para registro de usuarios
  async register(userData) {
    try {
      console.log('📝 Intentando registro real...');
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return result;
    } catch (error) {
      if (error.message === 'MODO_SIMULACION') {
        console.log('🔧 Usando simulación para registro');
        // Simulación de registro
        return {
          success: true,
          data: {
            userId: Math.floor(Math.random() * 1000),
            ...userData
          },
          message: 'Usuario registrado exitosamente (simulación)'
        };
      }
      throw error;
    }
  }
};

// Servicio principal para sistema de login
export const ApiService = {
  // =============================================
  // FUNCIONES DE AUTENTICACIÓN
  // =============================================
  ...AuthService,

  // =============================================
  // FUNCIONES GENERALES DE INCIDENTES
  // =============================================
  async createIncident(incidentData) {
    try {
      console.log('📝 Creando incidente real...');
      return await apiRequest('/incidents', {
        method: 'POST',
        body: JSON.stringify(incidentData),
      });
    } catch (error) {
      console.log('🔧 Usando simulación para createIncident');
      return await SimulationService.createIncident(incidentData);
    }
  },

  async getAllIncidents() {
    try {
      console.log('📋 Obteniendo todos los incidentes reales...');
      return await apiRequest('/incidents');
    } catch (error) {
      console.log('🔧 Usando simulación para getAllIncidents');
      return await SimulationService.getAllIncidents();
    }
  },

  async getIncidentById(id) {
    try {
      console.log('🔍 Obteniendo incidente real ID:', id);
      return await apiRequest(`/incidents/${id}`);
    } catch (error) {
      console.log('🔧 Usando simulación para getIncidentById');
      return { success: true, data: null };
    }
  },

  async updateIncidentStatus(id, status) {
    try {
      console.log('🔄 Actualizando estado real del incidente:', id, status);
      return await apiRequest(`/incidents/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.log('🔧 Usando simulación para updateIncidentStatus');
      return await SimulationService.updateIncidentStatus(id, status);
    }
  },

  async assignIncident(id, assignedTo) {
    try {
      console.log('👤 Asignando incidente real:', id, assignedTo);
      return await apiRequest(`/incidents/${id}/assign`, {
        method: 'PUT',
        body: JSON.stringify({ assignedTo }),
      });
    } catch (error) {
      console.log('🔧 Usando simulación para assignIncident');
      return await SimulationService.assignIncident(id, assignedTo);
    }
  },

  async addComment(incidentId, commentText, createdBy = 'Sistema') {
    try {
      console.log('💬 Agregando comentario real al incidente:', incidentId);
      return await apiRequest(`/incidents/${incidentId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ commentText, createdBy }),
      });
    } catch (error) {
      console.log('🔧 Usando simulación para addComment');
      return await SimulationService.addComment(incidentId, commentText, createdBy);
    }
  },

  // =============================================
  // FUNCIONES PARA VOLUNTARIOS
  // =============================================

  async registerVolunteer(profileData) {
    try {
      console.log('📝 Registrando voluntario real...');
      return await apiRequest('/volunteers/register', {
        method: 'POST',
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.log('🔧 Usando simulación para registerVolunteer');
      return await SimulationService.registerVolunteer(profileData);
    }
  },

  async getVolunteerProfile(email) {
    try {
      console.log('Obteniendo perfil real de voluntario:', email);
      return await apiRequest(`/volunteers/profile?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.log('Usando simulación para getVolunteerProfile');
      return await SimulationService.getVolunteerProfile(email);
    }
  },

  async getIncidentsForVolunteers() {
    try {
      console.log('Intentando cargar incidentes reales para voluntarios...');
      const result = await apiRequest('/volunteers/incidents');
      console.log('Incidentes reales cargados:', result.data?.length || 0);
      return result;
    } catch (error) {
      console.log('Cayendo a simulación para getIncidentsForVolunteers');
      return await SimulationService.getIncidentsForVolunteers();
    }
  },

  async assignVolunteerToIncident(incidentId, volunteerEmail, volunteerName = null) {
    try {
      console.log('Asignando voluntario real al incidente:', incidentId, volunteerEmail);
      return await apiRequest(`/volunteers/incidents/${incidentId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ 
          volunteerEmail,
          volunteerName: volunteerName || 'Voluntario'
        }),
      });
    } catch (error) {
      console.log('Usando simulación para assignVolunteerToIncident');
      return await SimulationService.assignVolunteerToIncident(incidentId, volunteerEmail, volunteerName);
    }
  },

  async unassignVolunteerFromIncident(incidentId, volunteerEmail, volunteerName = null) {
    try {
      console.log('Liberando voluntario real del incidente:', incidentId, volunteerEmail);
      return await apiRequest(`/volunteers/incidents/${incidentId}/unassign`, {
        method: 'POST',
        body: JSON.stringify({ 
          volunteerEmail,
          volunteerName: volunteerName || 'Voluntario'
        }),
      });
    } catch (error) {
      console.log('Usando simulación para unassignVolunteerFromIncident');
      return await SimulationService.unassignVolunteerFromIncident(incidentId, volunteerEmail);
    }
  },

  async getMyAssignments(volunteerEmail) {
    try {
      console.log('Obteniendo asignaciones reales para:', volunteerEmail);
      const result = await apiRequest(`/volunteers/assignments?email=${encodeURIComponent(volunteerEmail)}`);
      console.log('Asignaciones reales cargadas:', result.data?.length || 0);
      return result;
    } catch (error) {
      console.log('Cayendo a simulación para getMyAssignments');
      return await SimulationService.getMyAssignments(volunteerEmail);
    }
  },

  async addVolunteerComment(incidentId, commentText, authorName) {
    try {
      console.log('💬 Agregando comentario real como voluntario:', incidentId);
      return await apiRequest(`/volunteers/incidents/${incidentId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ commentText, authorName }),
      });
    } catch (error) {
      console.log('🔧 Usando simulación para addVolunteerComment');
      return await SimulationService.addVolunteerComment(incidentId, commentText, authorName);
    }
  },

  async updateVolunteerProfile(profileData) {
    try {
      console.log('🔄 Actualizando perfil real de voluntario...');
      return await apiRequest('/volunteers/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.log('🔧 Usando simulación para updateVolunteerProfile');
      return await SimulationService.updateVolunteerProfile(profileData);
    }
  },

  async getVolunteerStats() {
    try {
      console.log('📊 Obteniendo estadísticas reales de voluntarios...');
      return await apiRequest('/volunteers/stats');
    } catch (error) {
      console.log('🔧 Usando simulación para getVolunteerStats');
      return await SimulationService.getVolunteerStats();
    }
  },

  async updateAssignmentStatus(assignmentId, status) {
    try {
      console.log('🔄 Actualizando estado real de asignación:', assignmentId, status);
      return await apiRequest(`/volunteers/assignments/${assignmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.log('🔧 Usando simulación para updateAssignmentStatus');
      return { success: true, message: `Estado actualizado a ${status} (simulación)` };
    }
  },

  async getAllVolunteers() {
    try {
      console.log('👥 Obteniendo lista de voluntarios...');
      const result = await apiRequest('/volunteers');
      console.log(`${result.data?.length || 0} voluntarios obtenidos`);
      return result;
    } catch (error) {
      console.log('Usando simulación para getAllVolunteers');
      // Simulación temporal
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Angel Guaño',
            email: 'angel@espoch.edu.ec',
            phone: '+593 98 765 4321',
            status: 'active'
          },
          {
            id: 2,
            name: 'Jhostin Quispe',
            email: 'jhostin@espoch.edu.ec', 
            phone: '+593 98 765 4322',
            status: 'active'
          },
          {
            id: 3,
            name: 'Henry Redin',
            email: 'henry@espoch.edu.ec',
            phone: '+593 98 765 4323',
            status: 'active'
          }
        ]
      };
    }
  },

  // =============================================
  // FUNCIONES PARA ADMINISTRADOR
  // =============================================

  async getAdminIncidents() {
    try {
      console.log('👨‍💼 Obteniendo incidentes reales para admin...');
      return await apiRequest('/admin/incidents');
    } catch (error) {
      console.log('🔧 Usando simulación para getAdminIncidents');
      return await SimulationService.getAdminIncidents();
    }
  },

  async getIncidentVolunteerAssignments(incidentId) {
    try {
      console.log('📋 Obteniendo asignaciones reales de voluntarios para incidente:', incidentId);
      return await apiRequest(`/incidents/${incidentId}/volunteer-assignments`);
    } catch (error) {
      console.log('🔧 Usando simulación para getIncidentVolunteerAssignments');
      return await SimulationService.getIncidentVolunteerAssignments(incidentId);
    }
  },

  // =============================================
  // FUNCIONES DE DIAGNÓSTICO
  // =============================================

  async checkHealth() {
    try {
      console.log('🏥 Verificando salud del backend...');
      return await apiRequest('/health');
    } catch (error) {
      console.log('🔧 Usando simulación para checkHealth');
      return {
        success: false,
        database: { connected: false },
        message: 'No se pudo conectar al backend'
      };
    }
  },

  async getDebugIncidents() {
    try {
      console.log('🐛 Obteniendo incidentes para debug...');
      return await apiRequest('/debug/incidents');
    } catch (error) {
      console.log('🔧 Usando simulación para getDebugIncidents');
      return { success: false, error: error.message };
    }
  },

  // Función para obtener incidentes con información de voluntarios
  async getAllIncidentsWithVolunteers() {
    try {
      console.log('📊 Obteniendo incidentes con info de voluntarios...');
      const adminResult = await this.getAdminIncidents();
      if (adminResult.success) {
        return adminResult;
      }
      return await this.getAllIncidents();
    } catch (error) {
      console.log('🔧 Usando simulación para getAllIncidentsWithVolunteers');
      return await this.getAllIncidents();
    }
  },
};