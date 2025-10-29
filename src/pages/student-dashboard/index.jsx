import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      onClick: () => navigate('/incident-reporting')
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
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Acciones Rápidas
          </h2>
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