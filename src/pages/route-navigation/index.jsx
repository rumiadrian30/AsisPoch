import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MapContainer from './components/MapContainer';
import RouteInfoPanel from './components/RouteInfoPanel';
import AccessibilityFilters from './components/AccessibilityFilters';
import WeatherShuttlePanel from './components/WeatherShuttlePanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const RouteNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [userRole, setUserRole] = useState('student');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [accessibilityFilters, setAccessibilityFilters] = useState({});
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [incidents, setIncidents] = useState([]);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activePanel, setActivePanel] = useState('map'); // 'map', 'route', 'filters', 'info'

  // Mock incidents data
  const mockIncidents = [
    {
      id: 'incident-1',
      type: 'accessibility',
      severity: 'medium',
      title: 'Rampa temporal fuera de servicio',
      description: 'La rampa de acceso al edificio de Ciencias está en mantenimiento. Use la entrada alternativa.',
      location: { lat: -1.6512, lng: -78.6835 },
      reportedAt: new Date(Date.now() - 3600000),
      status: 'active'
    }
  ];

  // Mock saved routes
  const savedRoutes = [
    { id: 1, name: 'Administración → Biblioteca', icon: 'BookOpen' },
    { id: 2, name: 'Cafetería → Aulas', icon: 'Coffee' },
    { id: 3, name: 'Entrada Principal → Laboratorios', icon: 'FlaskConical' }
  ];

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Initialize location and incidents
  useEffect(() => {
    // Set mock current location (ESPOCH campus)
    setCurrentLocation({
      lat: -1.6508,
      lng: -78.6839,
      accuracy: 5
    });
    
    setIncidents(mockIncidents);

    // Check if coming from emergency request
    if (location?.state?.emergency) {
      setDestination('Enfermería Campus');
      // Auto-select emergency route
      setTimeout(() => {
        setSelectedRoute({
          id: 'emergency-route',
          name: 'Ruta de Emergencia a Enfermería',
          distance: '280m',
          duration: '4 min',
          accessibilityLevel: 'high',
          features: ['Ruta directa', 'Totalmente accesible', 'Bien iluminada'],
          isEmergency: true
        });
      }, 1000);
    }
  }, [location?.state]);

  // Handle location updates
  const handleLocationUpdate = (newLocation) => {
    setCurrentLocation(newLocation);
  };

  // Handle route selection
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    if (isMobileView) {
      setActivePanel('route');
    }
  };

  // Handle accessibility filters change
  const handleFiltersChange = (newFilters) => {
    setAccessibilityFilters(newFilters);
    // In a real app, this would trigger route recalculation
  };

  // Handle voice navigation toggle
  const handleVoiceToggle = (enabled) => {
    setIsVoiceEnabled(enabled);
    if (enabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        enabled ? 'Navegación por voz activada' : 'Navegación por voz desactivada'
      );
      utterance.lang = 'es-ES';
      window.speechSynthesis?.speak(utterance);
    }
  };

  // Handle navigation start
  const handleStartNavigation = (route) => {
    setNavigationStarted(true);
    setCurrentStep(0);
    
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Navegación iniciada. Siga las instrucciones.');
      utterance.lang = 'es-ES';
      window.speechSynthesis?.speak(utterance);
    }
  };

  // Handle emergency contact
  const handleEmergencyContact = (contact) => {
    // In a real app, this would initiate emergency communication
    console.log('Emergency contact:', contact);
  };

  // Handle role switching
  const handleRoleSwitch = (newRole) => {
    setUserRole(newRole);
  };

  // Handle emergency request
  const handleEmergencyRequest = () => {
    navigate('/request-assistance', { state: { emergency: true } });
  };

  // Handle destination search
  const handleDestinationSearch = (value) => {
    setDestination(value);
    // In a real app, this would trigger location search and route calculation
  };

  // Handle saved route selection
  const handleSavedRouteSelect = (route) => {
    setDestination(route?.name);
    // Auto-calculate route
    setTimeout(() => {
      setSelectedRoute({
        id: `saved-${route?.id}`,
        name: `Ruta: ${route?.name}`,
        distance: '320m',
        duration: '5 min',
        accessibilityLevel: 'high',
        features: ['Ruta guardada', 'Accesible', 'Familiar']
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        onRoleSwitch={handleRoleSwitch}
        onEmergencyRequest={handleEmergencyRequest}
      />
      <main className="flex-1">
        {/* Desktop Layout */}
        {!isMobileView ? (
          <div className="h-[calc(100vh-4rem)] flex">
            {/* Left Sidebar */}
            <div className="w-80 border-r border-border bg-surface overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Destination Search */}
                <div>
                  <Input
                    label="Destino"
                    type="text"
                    placeholder="Buscar ubicación en el campus..."
                    value={destination}
                    onChange={(e) => handleDestinationSearch(e?.target?.value)}
                    className="mb-3"
                  />
                  
                  {/* Saved Routes */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-foreground">Rutas Guardadas</h4>
                    {savedRoutes?.map((route) => (
                      <Button
                        key={route?.id}
                        variant="ghost"
                        onClick={() => handleSavedRouteSelect(route)}
                        iconName={route?.icon}
                        iconPosition="left"
                        className="w-full justify-start text-sm"
                      >
                        {route?.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Accessibility Filters */}
                <AccessibilityFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={accessibilityFilters}
                  isCollapsed={isFiltersCollapsed}
                  onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                />

                {/* Route Information */}
                <RouteInfoPanel
                  selectedRoute={selectedRoute}
                  isVoiceEnabled={isVoiceEnabled}
                  onVoiceToggle={handleVoiceToggle}
                  onStartNavigation={handleStartNavigation}
                  incidents={incidents}
                  currentStep={currentStep}
                />
              </div>
            </div>

            {/* Main Map Area */}
            <div className="flex-1 relative">
              <MapContainer
                currentLocation={currentLocation}
                destination={destination}
                selectedRoute={selectedRoute}
                accessibilityFilters={accessibilityFilters}
                onLocationUpdate={handleLocationUpdate}
                onRouteSelect={handleRouteSelect}
                incidents={incidents}
                isVoiceEnabled={isVoiceEnabled}
              />
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-border bg-surface overflow-y-auto">
              <div className="p-4">
                <WeatherShuttlePanel
                  onEmergencyContact={handleEmergencyContact}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Layout */
          (<div className="h-[calc(100vh-4rem)] relative">
            {/* Mobile Navigation Tabs */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-surface border-b border-border">
              <div className="flex">
                {[
                  { key: 'map', label: 'Mapa', icon: 'Map' },
                  { key: 'route', label: 'Ruta', icon: 'Navigation' },
                  { key: 'filters', label: 'Filtros', icon: 'Filter' },
                  { key: 'info', label: 'Info', icon: 'Info' }
                ]?.map((tab) => (
                  <Button
                    key={tab?.key}
                    variant={activePanel === tab?.key ? "default" : "ghost"}
                    onClick={() => setActivePanel(tab?.key)}
                    iconName={tab?.icon}
                    iconPosition="left"
                    iconSize={16}
                    className="flex-1 rounded-none text-xs"
                  >
                    {tab?.label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Mobile Content */}
            <div className="pt-12 h-full">
              {activePanel === 'map' && (
                <div className="h-full">
                  <MapContainer
                    currentLocation={currentLocation}
                    destination={destination}
                    selectedRoute={selectedRoute}
                    accessibilityFilters={accessibilityFilters}
                    onLocationUpdate={handleLocationUpdate}
                    onRouteSelect={handleRouteSelect}
                    incidents={incidents}
                    isVoiceEnabled={isVoiceEnabled}
                  />
                </div>
              )}

              {activePanel === 'route' && (
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  <Input
                    label="Destino"
                    type="text"
                    placeholder="Buscar ubicación..."
                    value={destination}
                    onChange={(e) => handleDestinationSearch(e?.target?.value)}
                  />
                  
                  <RouteInfoPanel
                    selectedRoute={selectedRoute}
                    isVoiceEnabled={isVoiceEnabled}
                    onVoiceToggle={handleVoiceToggle}
                    onStartNavigation={handleStartNavigation}
                    incidents={incidents}
                    currentStep={currentStep}
                  />
                </div>
              )}

              {activePanel === 'filters' && (
                <div className="h-full overflow-y-auto p-4">
                  <AccessibilityFilters
                    onFiltersChange={handleFiltersChange}
                    initialFilters={accessibilityFilters}
                    isCollapsed={false}
                    onToggleCollapse={() => {}}
                  />
                </div>
              )}

              {activePanel === 'info' && (
                <div className="h-full overflow-y-auto p-4">
                  <WeatherShuttlePanel
                    onEmergencyContact={handleEmergencyContact}
                  />
                </div>
              )}
            </div>
          </div>)
        )}

        {/* Navigation Status Bar (Mobile) */}
        {isMobileView && navigationStarted && (
          <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Navigation" size={16} />
                <span className="font-medium text-sm">Navegando...</span>
              </div>
              <div className="flex items-center space-x-2">
                {isVoiceEnabled && (
                  <Icon name="Volume2" size={16} />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNavigationStarted(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Detener
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RouteNavigation;