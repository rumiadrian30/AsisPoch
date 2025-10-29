// services/assistanceRequestService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Verificar si el backend está disponible
let backendAvailable = false;

// Función para verificar la disponibilidad del backend
const checkBackendAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/assistance-requests`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
    });
    backendAvailable = response.ok;
    console.log(backendAvailable ? '✅ Backend disponible para assistance requests' : '❌ Backend no disponible');
  } catch (error) {
    backendAvailable = false;
    console.log('🔧 Modo simulación activado para assistance requests - Backend no disponible');
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

// Servicio de simulación para Assistance Requests
const SimulationService = {
  createRequest: (requestData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const correlationId = `REQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        resolve({
          success: true,
          data: {
            id: Math.floor(Math.random() * 1000),
            ...requestData,
            correlation_id: correlationId,
            status: 'pending',
            requested_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          message: 'Solicitud de asistencia creada exitosamente (modo simulación)'
        });
      }, 1000);
    });
  },

  getUserRequests: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockRequests = [
          {
            id: 1,
            correlation_id: 'REQ-231215-0001',
            assistance_type: 'mobility',
            title: 'Asistencia de Movilidad',
            description: 'Necesito ayuda para llegar a la Biblioteca desde el Edificio de Informática',
            status: 'assigned',
            priority: 'high',
            location_building: 'Facultad de Informática y Electrónica',
            location_area: 'Aula 201',
            urgency_level: 'high',
            accessibility_needs: ['wheelchair'],
            communication_method: 'phone',
            requested_at: new Date(Date.now() - 1800000).toISOString(),
            assigned_at: new Date(Date.now() - 1700000).toISOString(),
            assigned_staff_name: 'Carlos Mendoza',
            assigned_staff_role: 'Asistente de Movilidad',
            assigned_staff_contact: '+593-99-876-5432',
            estimated_response_time: '10-20 min'
          },
          {
            id: 2,
            correlation_id: 'REQ-231215-0002',
            assistance_type: 'academic',
            title: 'Consulta Académica',
            description: 'Consulta sobre adaptaciones curriculares para el próximo semestre',
            status: 'pending',
            priority: 'medium',
            location_building: 'Oficina de Inclusión',
            urgency_level: 'medium',
            accessibility_needs: ['visual_impairment'],
            communication_method: 'email',
            requested_at: new Date(Date.now() - 3600000).toISOString(),
            estimated_response_time: '30-60 min'
          }
        ];
        resolve({ 
          success: true, 
          data: mockRequests 
        });
      }, 500);
    });
  },

  getRequestById: (requestId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          data: {
            id: requestId,
            correlation_id: 'REQ-231215-0001',
            assistance_type: 'mobility',
            title: 'Asistencia de Movilidad',
            description: 'Necesito ayuda para llegar a la Biblioteca desde el Edificio de Informática',
            status: 'assigned',
            priority: 'high',
            location_building: 'Facultad de Informática y Electrónica',
            location_area: 'Aula 201',
            urgency_level: 'high',
            accessibility_needs: ['wheelchair'],
            communication_method: 'phone',
            requested_at: new Date(Date.now() - 1800000).toISOString(),
            assigned_at: new Date(Date.now() - 1700000).toISOString(),
            assigned_staff_name: 'Carlos Mendoza',
            assigned_staff_role: 'Asistente de Movilidad',
            assigned_staff_contact: '+593-99-876-5432',
            estimated_response_time: '10-20 min'
          }
        });
      }, 500);
    });
  },

  updateRequest: (requestId, updateData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `Solicitud ${requestId} actualizada (simulación)`,
          data: { id: requestId, ...updateData }
        });
      }, 500);
    });
  },

  cancelRequest: (requestId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Solicitud cancelada exitosamente (simulación)' 
        });
      }, 500);
    });
  },

  getAssistanceTypes: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 1,
              type_key: 'mobility',
              label: 'Asistencia de Movilidad',
              description: 'Ayuda con desplazamiento, acceso a edificios, o navegación en el campus',
              icon_name: 'Accessibility',
              category: 'mobility',
              default_priority: 'medium',
              response_time_estimate: {
                low: '2-4 horas',
                medium: '30-60 min',
                high: '10-20 min',
                critical: '< 5 min'
              }
            },
            {
              id: 2,
              type_key: 'academic',
              label: 'Apoyo Académico',
              description: 'Asistencia con materiales, tecnología adaptativa, o servicios educativos',
              icon_name: 'BookOpen',
              category: 'academic',
              default_priority: 'medium',
              response_time_estimate: {
                low: '4-6 horas',
                medium: '1-2 horas',
                high: '30-45 min',
                critical: '< 15 min'
              }
            },
            {
              id: 3,
              type_key: 'wellness',
              label: 'Bienestar y Salud',
              description: 'Apoyo psicológico, servicios médicos, o asistencia de bienestar',
              icon_name: 'Heart',
              category: 'wellness',
              default_priority: 'high',
              response_time_estimate: {
                low: '1-2 horas',
                medium: '30-60 min',
                high: '10-20 min',
                critical: '< 5 min'
              }
            },
            {
              id: 4,
              type_key: 'emergency',
              label: 'Emergencia',
              description: 'Situaciones urgentes que requieren atención inmediata',
              icon_name: 'AlertTriangle',
              category: 'emergency',
              default_priority: 'critical',
              response_time_estimate: {
                critical: '< 5 min'
              }
            }
          ]
        });
      }, 300);
    });
  },

  getCampusLocations: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 1,
              location_key: 'biblioteca-central',
              name: 'Biblioteca Central',
              code: 'BC',
              description: 'Biblioteca principal del campus',
              coordinates: { lat: -1.6508, lng: -78.6839 },
              accessibility_level: 'full',
              accessibility_features: ['ramps', 'elevators', 'accessible_restrooms', 'tactile_paths']
            },
            {
              id: 2,
              location_key: 'facultad-informatica',
              name: 'Facultad de Informática y Electrónica',
              code: 'FIE',
              description: 'Edificio de facultad de informática',
              coordinates: { lat: -1.6512, lng: -78.6845 },
              accessibility_level: 'partial',
              accessibility_features: ['ramps', 'accessible_restrooms']
            }
          ]
        });
      }, 300);
    });
  },

  getAccessibilityNeeds: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 1,
              need_key: 'wheelchair',
              label: 'Usuario de silla de ruedas',
              description: 'Necesito acceso para silla de ruedas y espacios amplios',
              icon_name: 'Wheelchair',
              category: 'mobility',
              requires_special_equipment: true
            },
            {
              id: 2,
              need_key: 'visual_impairment',
              label: 'Discapacidad visual',
              description: 'Requiero asistencia para navegación y lectura',
              icon_name: 'Eye',
              category: 'visual',
              requires_special_equipment: true
            }
          ]
        });
      }, 300);
    });
  },

  getCommunicationMethods: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            { id: 1, method_key: 'phone', label: 'Llamada telefónica', icon_name: 'Phone', requires_contact_info: true },
            { id: 2, method_key: 'sms', label: 'Mensaje de texto (SMS)', icon_name: 'MessageCircle', requires_contact_info: true },
            { id: 3, method_key: 'email', label: 'Correo electrónico', icon_name: 'Mail', requires_contact_info: true },
            { id: 4, method_key: 'whatsapp', label: 'WhatsApp', icon_name: 'MessageSquare', requires_contact_info: true },
            { id: 5, method_key: 'in_person', label: 'Comunicación en persona', icon_name: 'User', requires_contact_info: false },
            { id: 6, method_key: 'sign_language', label: 'Lenguaje de señas', icon_name: 'Hand', requires_contact_info: false }
          ]
        });
      }, 300);
    });
  },

  submitFeedback: (requestId, feedbackData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Feedback enviado exitosamente (simulación)' 
        });
      }, 500);
    });
  }
};

// Servicio principal para Assistance Requests
export const AssistanceRequestService = {
  async createRequest(requestData) {
    try {
      return await apiRequest('/assistance-requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
    } catch (error) {
      return await SimulationService.createRequest(requestData);
    }
  },

  async getUserRequests(userId) {
    try {
      return await apiRequest(`/users/${userId}/assistance-requests`);
    } catch (error) {
      return await SimulationService.getUserRequests(userId);
    }
  },

  async getRequestById(requestId) {
    try {
      return await apiRequest(`/assistance-requests/${requestId}`);
    } catch (error) {
      return await SimulationService.getRequestById(requestId);
    }
  },

  async getRequestByCorrelationId(correlationId) {
    try {
      return await apiRequest(`/assistance-requests/correlation/${correlationId}`);
    } catch (error) {
      return { success: false, error: 'No se pudo encontrar la solicitud' };
    }
  },

  async updateRequest(requestId, updateData) {
    try {
      return await apiRequest(`/assistance-requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      return await SimulationService.updateRequest(requestId, updateData);
    }
  },

  async cancelRequest(requestId) {
    try {
      return await apiRequest(`/assistance-requests/${requestId}/cancel`, {
        method: 'PATCH',
      });
    } catch (error) {
      return await SimulationService.cancelRequest(requestId);
    }
  },

  async getAssistanceTypes() {
    try {
      return await apiRequest('/assistance-types');
    } catch (error) {
      return await SimulationService.getAssistanceTypes();
    }
  },

  async getCampusLocations() {
    try {
      return await apiRequest('/campus-locations');
    } catch (error) {
      return await SimulationService.getCampusLocations();
    }
  },

  async getAccessibilityNeeds() {
    try {
      return await apiRequest('/accessibility-needs');
    } catch (error) {
      return await SimulationService.getAccessibilityNeeds();
    }
  },

  async getCommunicationMethods() {
    try {
      return await apiRequest('/communication-methods');
    } catch (error) {
      return await SimulationService.getCommunicationMethods();
    }
  },

  async submitFeedback(requestId, feedbackData) {
    try {
      return await apiRequest(`/assistance-requests/${requestId}/feedback`, {
        method: 'POST',
        body: JSON.stringify(feedbackData),
      });
    } catch (error) {
      return await SimulationService.submitFeedback(requestId, feedbackData);
    }
  },

  async getUserStats(userId) {
    try {
      return await apiRequest(`/users/${userId}/assistance-stats`);
    } catch (error) {
      return {
        success: true,
        data: {
          total_requests: 12,
          completed_requests: 8,
          average_response_time: '8 min',
          routes_used: 25
        }
      };
    }
  },

  // Métodos para verificación de salud
  async checkHealth() {
    try {
      return await apiRequest('/health');
    } catch (error) {
      return {
        success: false,
        database: { connected: false },
        message: 'No se pudo conectar al backend para assistance requests'
      };
    }
  },

  async getDebugRequests() {
    try {
      return await apiRequest('/debug/assistance-requests');
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Exportar para uso en otros componentes
export default AssistanceRequestService;