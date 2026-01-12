import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncidentMap = ({ incidents, selectedIncident, onIncidentSelect, filters }) => {
  const mapRef = useRef(null);
  const [mapView, setMapView] = useState('satellite');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Filter incidents based on current filters
  const filteredIncidents = incidents?.filter(incident => {
    if (filters?.status && filters?.status !== 'all' && incident?.status !== filters?.status) return false;
    if (filters?.severity && filters?.severity !== 'all' && incident?.severity !== filters?.severity) return false;
    if (filters?.location && !incident?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())) return false;
    return true;
  });

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'disconnected');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get marker color based on severity
  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Get affected area radius based on impact
  const getAffectedRadius = (impact) => {
    switch (impact) {
      case 'major': return 100;
      case 'moderate': return 60;
      case 'minor': return 30;
      default: return 20;
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${
      isFullscreen ? 'fixed inset-4 z-50' : 'h-full'
    }`}>
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center space-x-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Mapa de Incidentes del Campus
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-success' : 'bg-error'
            }`} />
            <span className="text-sm font-caption text-muted-foreground">
              {connectionStatus === 'connected' ? 'En línea' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Map View Toggle */}
          <div className="flex bg-background border border-border rounded-lg p-1">
            <Button
              variant={mapView === 'satellite' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMapView('satellite')}
              className="px-3 py-1"
            >
              Satélite
            </Button>
            <Button
              variant={mapView === 'street' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMapView('street')}
              className="px-3 py-1"
            >
              Calles
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleFullscreenToggle}
            iconName={isFullscreen ? "Minimize2" : "Maximize2"}
            className="w-8 h-8"
          />
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-full min-h-96">
        <div ref={mapRef} className="w-full h-full bg-muted">
          {/* Google Maps Iframe */}
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Campus ESPOCH - Mapa de Incidentes"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=-1.6508,-78.6839&z=16&output=embed"
            className="w-full h-full"
          />

          {/* Incident Markers Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {filteredIncidents?.map((incident, index) => (
              <div
                key={incident?.id}
                className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${20 + (index % 8) * 10}%`,
                  top: `${30 + Math.floor(index / 8) * 15}%`
                }}
                onClick={() => onIncidentSelect(incident)}
              >
                {/* Affected Area Circle */}
                <div
                  className="absolute rounded-full opacity-20"
                  style={{
                    width: `${getAffectedRadius(incident?.impact)}px`,
                    height: `${getAffectedRadius(incident?.impact)}px`,
                    backgroundColor: getMarkerColor(incident?.severity),
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />

                {/* Incident Marker */}
                <div
                  className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                    selectedIncident?.id === incident?.id ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: getMarkerColor(incident?.severity) }}
                >
                  <Icon
                    name={incident?.type === 'accessibility' ? 'Accessibility' : 
                          incident?.type === 'infrastructure' ? 'Construction' :
                          incident?.type === 'safety' ? 'Shield' : 'AlertTriangle'}
                    size={16}
                    className="text-white"
                  />
                </div>

                {/* Incident Info Popup */}
                {selectedIncident?.id === incident?.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-popover border border-border rounded-lg shadow-lg p-3 animate-slide-up">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-popover-foreground">
                          {incident?.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident?.severity === 'critical' ? 'bg-error/10 text-error' :
                          incident?.severity === 'high' ? 'bg-warning/10 text-warning' :
                          incident?.severity === 'medium'? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                        }`}>
                          {incident?.severity === 'critical' ? 'Crítico' :
                           incident?.severity === 'high' ? 'Alto' :
                           incident?.severity === 'medium' ? 'Medio' : 'Bajo'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {incident?.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {incident?.location}
                        </span>
                        <span className="text-muted-foreground">
                          {incident?.reportedAt}
                        </span>
                      </div>
                    </div>
                    
                    {/* Arrow pointer */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
          <h4 className="font-medium text-sm text-foreground mb-2">Leyenda</h4>
          <div className="space-y-2">
            {[
              { severity: 'critical', label: 'Crítico', color: '#DC2626' },
              { severity: 'high', label: 'Alto', color: '#F59E0B' },
              { severity: 'medium', label: 'Medio', color: '#3B82F6' },
              { severity: 'low', label: 'Bajo', color: '#10B981' }
            ]?.map((item) => (
              <div key={item?.severity} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-xs text-muted-foreground">{item?.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Overlay */}
        <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total:</span>
              <span className="text-sm font-medium text-foreground">
                {filteredIncidents?.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Activos:</span>
              <span className="text-sm font-medium text-warning">
                {filteredIncidents?.filter(i => i?.status === 'active')?.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Resueltos:</span>
              <span className="text-sm font-medium text-success">
                {filteredIncidents?.filter(i => i?.status === 'resolved')?.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentMap;