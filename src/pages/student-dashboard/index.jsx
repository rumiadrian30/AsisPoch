import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AssistanceRequestCard from './components/AssistanceRequestCard';
import QuickActionCard from './components/QuickActionCard';
import AccessibleMapView from './components/AccessibleMapView';
import NotificationPanel from './components/NotificationPanel';
import AccessibilityPreferences from './components/AccessibilityPreferences';
import AlertBanner from './components/AlertBanner';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser] = useState({
    id: 1,
    name: "Rumi Adrian Grefa Rivadeneyra",
    email: "rui.grefa@espoch.edu.ec",
    studentId: "7333",
    faculty: "Facultad de Informática y Electrónica",
    accessibilityNeeds: ["wheelchair", "visual_support"]
  });

  const [activeRequests, setActiveRequests] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [chainProcessingResult, setChainProcessingResult] = useState(null);
  const [showChainSuccess, setShowChainSuccess] = useState(false);

  // Mock active assistance requests
  const mockRequests = [
    {
      id: 1,
      type: "Asistencia de Movilidad",
      typeIcon: "Wheelchair",
      description: "Necesito ayuda para llegar a la Biblioteca desde el Edificio de Informática",
      location: "Edificio de Informática - Aula 201",
      status: "assigned",
      statusText: "Asignado",
      requestedAt: new Date(Date.now() - 1800000),
      assignedStaff: {
        name: "Carlos Mendoza",
        role: "Asistente de Movilidad",
        id: "staff_001"
      },
      staffContact: {
        phone: "+593-99-876-5432"
      },
      eta: 300000 // 5 minutes
    },
    {
      id: 2,
      type: "Consulta Académica",
      typeIcon: "BookOpen",
      description: "Consulta sobre adaptaciones curriculares para el próximo semestre",
      location: "Oficina de Inclusión",
      status: "pending",
      statusText: "Pendiente",
      requestedAt: new Date(Date.now() - 3600000),
      assignedStaff: null,
      eta: null
    }
  ];

  // Check for Chain of Responsibility results from incident reporting
  useEffect(() => {
    if (location?.state?.processedByChain) {
      setChainProcessingResult({
        reportSubmitted: location.state.reportSubmitted,
        trackingNumber: location.state.trackingNumber,
        severity: location.state.severity,
        estimatedResolution: location.state.estimatedResolution,
        chainHandlers: location.state.chainHandlers || [],
        chainDuration: location.state.chainDuration || 0,
        timestamp: new Date()
      });
      setShowChainSuccess(true);
      
      // Clear the state after showing
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Auto-hide Chain of Responsibility success message after 10 seconds
  useEffect(() => {
    if (showChainSuccess) {
      const timer = setTimeout(() => {
        setShowChainSuccess(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showChainSuccess]);

  // WebSocket simulation for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'disconnected');
      setLastUpdate(new Date());
      
      // Simulate request status updates
      setActiveRequests(prev => 
        prev?.map(request => {
          if (request?.status === 'assigned' && Math.random() > 0.7) {
            return { ...request, status: 'in-progress', statusText: 'En Progreso' };
          }
          return request;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Initialize with mock data
  useEffect(() => {
    setActiveRequests(mockRequests);
  }, []);

  const handleEmergencyRequest = () => {
    navigate('/request-assistance', { state: { emergency: true } });
  };

  const handleViewRequestDetails = (requestId) => {
    navigate('/request-assistance', { state: { viewRequest: requestId } });
  };

  const handleCancelRequest = (requestId) => {
    setActiveRequests(prev => prev?.filter(req => req?.id !== requestId));
  };

  const handleRouteSelect = (route) => {
    if (route === 'navigate' || route === 'plan') {
      navigate('/route-navigation');
    } else {
      navigate('/route-navigation', { state: { selectedRoute: route } });
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification?.type === 'alert') {
      navigate('/incident-reporting', { state: { viewIncident: notification?.id } });
    } else if (notification?.type === 'update') {
      navigate('/request-assistance', { state: { viewRequest: notification?.relatedRequestId } });
    }
  };

  const handleAlertViewAlternatives = (alert) => {
    navigate('/route-navigation', { state: { avoidLocation: alert?.location } });
  };

  const handleAlertViewDetails = (alert) => {
    navigate('/incident-reporting', { state: { viewIncident: alert?.id } });
  };

  const quickActions = [
    {
      title: "Solicitar Asistencia",
      description: "Obtén ayuda inmediata para movilidad, orientación o apoyo académico",
      icon: "HelpCircle",
      iconColor: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/20",
      onClick: () => navigate('/request-assistance'),
      badge: activeRequests?.filter(r => r?.status === 'pending')?.length > 0 ? 
        activeRequests?.filter(r => r?.status === 'pending')?.length : null
    },
    {
      title: "Navegación Accesible",
      description: "Encuentra la ruta más accesible a tu destino con información en tiempo real",
      icon: "Navigation",
      iconColor: "text-secondary",
      bgColor: "bg-secondary/5",
      borderColor: "border-secondary/20",
      onClick: () => navigate('/route-navigation')
    },
    {
      title: "Reportar Incidente",
      description: "Informa sobre obstáculos, barreras o problemas de accesibilidad en el campus",
      icon: "AlertTriangle",
      iconColor: "text-warning",
      bgColor: "bg-warning/5",
      borderColor: "border-warning/20",
      onClick: () => navigate('/incident-reporting'),
      chainBadge: true // Indica que usa Chain of Responsibility
    },
    {
      title: "Servicios de Bienestar",
      description: "Accede a servicios de apoyo académico, psicológico y de bienestar estudiantil",
      icon: "Heart",
      iconColor: "text-success",
      bgColor: "bg-success/5",
      borderColor: "border-success/20",
      onClick: () => navigate('/wellness-services')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="student" 
        onEmergencyRequest={handleEmergencyRequest}
      />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                ¡Bienvenido, {currentUser?.name}!
              </h1>
              <p className="text-muted-foreground">
                {currentUser?.faculty} • ID: {currentUser?.studentId}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-success' : 'bg-error'
                }`} />
                <span className="text-sm text-muted-foreground">
                  {connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'} • 
                  Última actualización: {lastUpdate?.toLocaleTimeString('es-ES')}
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {new Date()?.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date()?.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chain of Responsibility Success Banner */}
        {showChainSuccess && chainProcessingResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="GitBranch" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">
                    ✅ Reporte procesado con Chain of Responsibility
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    Tu reporte fue procesado automáticamente por nuestra cadena de responsabilidad.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700">
                        {chainProcessingResult.trackingNumber}
                      </div>
                      <div className="text-xs text-blue-600">N° de seguimiento</div>
                    </div>
                    
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700">
                        {chainProcessingResult.chainHandlers.length}
                      </div>
                      <div className="text-xs text-blue-600">Handlers ejecutados</div>
                    </div>
                    
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700">
                        {chainProcessingResult.chainDuration}ms
                      </div>
                      <div className="text-xs text-blue-600">Tiempo de procesamiento</div>
                    </div>
                    
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700">
                        {chainProcessingResult.estimatedResolution}
                      </div>
                      <div className="text-xs text-blue-600">Resolución estimada</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {chainProcessingResult.chainHandlers.map((handler, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1"
                      >
                        <Icon name="CheckCircle" size={10} />
                        <span>{handler}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChainSuccess(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Alert Banners */}
        <AlertBanner
          alerts={[]}
          onViewAlternatives={handleAlertViewAlternatives}
          onViewDetails={handleAlertViewDetails}
          onDismiss={() => {}}
        />

        {/* Active Requests Section */}
        {activeRequests?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Solicitudes Activas
              </h2>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={() => navigate('/request-assistance')}
              >
                Nueva Solicitud
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {activeRequests?.map((request) => (
                <AssistanceRequestCard
                  key={request?.id}
                  request={request}
                  onViewDetails={handleViewRequestDetails}
                  onCancelRequest={handleCancelRequest}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Acciones Rápidas
            </h2>
            <span className="text-sm text-muted-foreground flex items-center space-x-1">
              <Icon name="GitBranch" size={14} className="text-primary" />
              <span>🏗️ = Chain of Responsibility</span>
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions?.map((action, index) => (
              <QuickActionCard
                key={index}
                {...action}
              />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <AccessibleMapView
              currentLocation={{
                lat: -1.6508,
                lng: -78.6839,
                name: "Facultad de Informática y Electrónica"
              }}
              accessibleRoutes={[]}
              incidents={[]}
              onRouteSelect={handleRouteSelect}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Notifications Panel */}
            <NotificationPanel
              notifications={[]}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={() => {}}
              onMarkAllAsRead={() => {}}
            />

            {/* Chain of Responsibility Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="GitBranch" size={16} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-800">Chain of Responsibility</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="GitMerge" size={14} className="text-blue-600" />
                    <span className="text-sm text-blue-700">Handlers disponibles</span>
                  </div>
                  <span className="font-medium text-blue-800">5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Zap" size={14} className="text-green-600" />
                    <span className="text-sm text-blue-700">Reportes procesados</span>
                  </div>
                  <span className="font-medium text-blue-800">24</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-purple-600" />
                    <span className="text-sm text-blue-700">Tiempo promedio</span>
                  </div>
                  <span className="font-medium text-blue-800">320ms</span>
                </div>
                
                <div className="pt-2 border-t border-blue-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/incident-reporting')}
                    iconName="AlertTriangle"
                    iconPosition="left"
                    className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    Probar Chain of Responsibility
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm text-muted-foreground">Solicitudes completadas</span>
                  </div>
                  <span className="font-medium text-foreground">12</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-warning" />
                    <span className="text-sm text-muted-foreground">Tiempo promedio de respuesta</span>
                  </div>
                  <span className="font-medium text-foreground">8 min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Navigation" size={16} className="text-primary" />
                    <span className="text-sm text-muted-foreground">Rutas utilizadas</span>
                  </div>
                  <span className="font-medium text-foreground">25</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-error" />
                    <span className="text-sm text-muted-foreground">Incidentes reportados</span>
                  </div>
                  <span className="font-medium text-foreground">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chain of Responsibility Explanation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="GitBranch" size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                ¿Qué es Chain of Responsibility?
              </h3>
              <p className="text-blue-700 mb-3">
                Es un patrón de diseño que procesa automáticamente tus reportes de incidentes 
                a través de una cadena de handlers especializados. Cada handler analiza el 
                incidente y toma acciones específicas según su tipo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { icon: 'AlertTriangle', label: 'Emergencia', desc: 'Criticidad máxima' },
                  { icon: 'Accessibility', label: 'Accesibilidad', desc: 'Impacto en movilidad' },
                  { icon: 'Wrench', label: 'Infraestructura', desc: 'Daños estructurales' },
                  { icon: 'FileText', label: 'Documentación', desc: 'Registro completo' },
                  { icon: 'Bell', label: 'Notificaciones', desc: 'Alertas automáticas' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/70 p-3 rounded border border-blue-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon name={item.icon} size={14} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">{item.label}</span>
                    </div>
                    <p className="text-xs text-blue-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Preferences */}
        <section>
          <AccessibilityPreferences
            preferences={{
              mobilityAids: ['wheelchair'],
              visualSupport: ['high_contrast'],
              auditorySupport: [],
              cognitiveSupport: ['simple_navigation'],
              routePreferences: {
                avoidStairs: true,
                preferRamps: true,
                avoidCrowdedAreas: false,
                requireElevators: true,
                maxWalkingDistance: 500
              },
              notificationPreferences: {
                pushNotifications: true,
                smsAlerts: true,
                emailUpdates: false,
                voiceAlerts: false
              },
              emergencyContacts: [
                {
                  id: 1,
                  name: "Jhostin Quispe",
                  relationship: "Compañero de clase",
                  phone: "+593-99-123-4567",
                  isPrimary: true
                }
              ]
            }}
            onSavePreferences={(preferences) => {
              console.log('Saving preferences:', preferences);
              // Here you would typically save to backend
            }}
            onUpdatePreferences={(preferences) => {
              console.log('Updating preferences:', preferences);
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;