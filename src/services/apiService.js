const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Verificar si el backend está disponible
let backendAvailable = false;

// Función para verificar la disponibilidad del backend
const checkBackendAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
    });
    backendAvailable = response.ok;
    console.log(backendAvailable ? '✅ Backend disponible' : '❌ Backend no disponible');
  } catch (error) {
    backendAvailable = false;
    console.log('🔧 Modo simulación activado - Backend no disponible');
  }
};

// Verificar al cargar
checkBackendAvailability();

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  // Si el backend no está disponible, usar simulación inmediatamente
  if (!backendAvailable) {
    throw new Error('MODO_SIMULACION');
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 Making API request to:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ API request failed:', error.message);
    
    // Si hay error de conexión, marcar backend como no disponible
    if (error.name === 'TimeoutError' || error.message.includes('Failed to fetch')) {
      backendAvailable = false;
    }
    
    throw new Error('MODO_SIMULACION');
  }
};

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
  }
};

// Servicio principal
export const ApiService = {
  async createIncident(incidentData) {
    try {
      return await apiRequest('/incidents', {
        method: 'POST',
        body: JSON.stringify(incidentData),
      });
    } catch (error) {
      return await SimulationService.createIncident(incidentData);
    }
  },

  async getAllIncidents() {
    try {
      return await apiRequest('/incidents');
    } catch (error) {
      return await SimulationService.getAllIncidents();
    }
  },

  async getIncidentById(id) {
    try {
      return await apiRequest(`/incidents/${id}`);
    } catch (error) {
      return { success: true, data: null };
    }
  },

  async updateIncidentStatus(id, status) {
    try {
      return await apiRequest(`/incidents/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      return await SimulationService.updateIncidentStatus(id, status);
    }
  },

  async assignIncident(id, assignedTo) {
    try {
      return await apiRequest(`/incidents/${id}/assign`, {
        method: 'PUT',
        body: JSON.stringify({ assignedTo }),
      });
    } catch (error) {
      return await SimulationService.assignIncident(id, assignedTo);
    }
  },

  async addComment(incidentId, commentText, createdBy = 'Sistema') {
    try {
      return await apiRequest(`/incidents/${incidentId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ commentText, createdBy }),
      });
    } catch (error) {
      return await SimulationService.addComment(incidentId, commentText, createdBy);
    }
  },

  // Nuevos métodos para verificación
  async checkHealth() {
    try {
      return await apiRequest('/health');
    } catch (error) {
      return {
        success: false,
        database: { connected: false },
        message: 'No se pudo conectar al backend'
      };
    }
  },

  async getDebugIncidents() {
    try {
      return await apiRequest('/debug/incidents');
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};