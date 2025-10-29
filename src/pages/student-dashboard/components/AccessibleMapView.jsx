import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccessibleMapView = ({ currentLocation, accessibleRoutes, incidents, onRouteSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapMode, setMapMode] = useState('accessibility'); // 'accessibility', 'incidents', 'routes'

  // Mock current location for ESPOCH campus
  const mockLocation = {
    lat: -1.6508,
    lng: -78.6839,
    name: "Facultad de Informática y Electrónica"
  };

  const mockRoutes = [
    {
      id: 1,
      name: "Ruta Principal - Biblioteca",
      accessibility: "high",
      accessibilityText: "Alta Accesibilidad",
      distance: "320m",
      estimatedTime: "4 min",
      features: ["Rampas disponibles", "Superficie lisa", "Iluminación adecuada"],
      warnings: []
    },
    {
      id: 2,
      name: "Ruta Alternativa - Cafetería",
      accessibility: "medium",
      accessibilityText: "Accesibilidad Media",
      distance: "450m",
      estimatedTime: "6 min",
      features: ["Algunas rampas", "Superficie irregular en tramos"],
      warnings: ["Construcción en progreso"]
    },
    {
      id: 3,
      name: "Ruta Directa - Auditorio",
      accessibility: "low",
      accessibilityText: "Accesibilidad Limitada",
      distance: "280m",
      estimatedTime: "8 min",
      features: ["Escalones presentes"],
      warnings: ["No recomendado para sillas de ruedas", "Superficie irregular"]
    }
  ];

  const mockIncidents = [
    {
      id: 1,
      type: "construction",
      severity: "medium",
      location: "Pasillo Principal - Edificio A",
      description: "Trabajos de mantenimiento en rampa de acceso",
      reportedAt: new Date(Date.now() - 3600000),
      affectedRoutes: [1, 2]
    },
    {
      id: 2,
      type: "obstacle",
      severity: "low",
      location: "Entrada Biblioteca",
      description: "Mobiliario temporal bloqueando acceso",
      reportedAt: new Date(Date.now() - 1800000),
      affectedRoutes: [1]
    }
  ];

  const getAccessibilityColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-success bg-success/10 border-success/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `hace ${hours}h`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-foreground">
            Mapa de Accesibilidad
          </h3>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isExpanded ? "default" : "outline"}
              size="sm"
              iconName={isExpanded ? "Minimize2" : "Maximize2"}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Contraer mapa" : "Expandir mapa"}
            />
          </div>
        </div>

        {/* Map Mode Selector */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setMapMode('accessibility')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              mapMode === 'accessibility' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Accesibilidad
          </button>
          <button
            onClick={() => setMapMode('incidents')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              mapMode === 'incidents' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Incidentes
          </button>
          <button
            onClick={() => setMapMode('routes')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              mapMode === 'routes' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Rutas
          </button>
        </div>
      </div>
      {/* Map Container */}
      <div className={`relative ${isExpanded ? 'h-96' : 'h-64'} bg-muted`}>
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Mapa del Campus ESPOCH"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mockLocation?.lat},${mockLocation?.lng}&z=17&output=embed`}
          className="w-full h-full"
        />

        {/* Current Location Indicator */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <div>
              <p className="text-sm font-medium text-foreground">Ubicación Actual</p>
              <p className="text-xs text-muted-foreground">{mockLocation?.name}</p>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">Leyenda</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-xs text-muted-foreground">Alta Accesibilidad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full" />
              <span className="text-xs text-muted-foreground">Media Accesibilidad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full" />
              <span className="text-xs text-muted-foreground">Baja Accesibilidad</span>
            </div>
          </div>
        </div>
      </div>
      {/* Map Content Based on Mode */}
      <div className="p-4">
        {mapMode === 'accessibility' && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Rutas Accesibles Disponibles</h4>
            {mockRoutes?.map((route) => (
              <div
                key={route?.id}
                className="border border-border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedRoute(route);
                  onRouteSelect && onRouteSelect(route);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm text-foreground">{route?.name}</h5>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-muted-foreground">{route?.distance}</span>
                      <span className="text-xs text-muted-foreground">{route?.estimatedTime}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getAccessibilityColor(route?.accessibility)}`}>
                    {route?.accessibilityText}
                  </div>
                </div>

                <div className="space-y-1">
                  {route?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={12} className="text-success" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                  
                  {route?.warnings?.map((warning, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={12} className="text-warning" />
                      <span className="text-xs text-warning">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {mapMode === 'incidents' && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Incidentes Activos</h4>
            {mockIncidents?.length > 0 ? (
              mockIncidents?.map((incident) => (
                <div key={incident?.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-foreground">{incident?.location}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{incident?.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getSeverityColor(incident?.severity)}`}>
                      {incident?.severity === 'high' ? 'Alto' : incident?.severity === 'medium' ? 'Medio' : 'Bajo'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Reportado {formatTimeAgo(incident?.reportedAt)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Afecta {incident?.affectedRoutes?.length} ruta(s)
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No hay incidentes activos</p>
              </div>
            )}
          </div>
        )}

        {mapMode === 'routes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Planificador de Rutas</h4>
              <Button
                variant="outline"
                size="sm"
                iconName="Navigation"
                iconPosition="left"
                onClick={() => onRouteSelect && onRouteSelect('navigate')}
              >
                Navegar
              </Button>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Icon name="MapPin" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Selecciona un destino para calcular la ruta más accesible
              </p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => onRouteSelect && onRouteSelect('plan')}
              >
                Planificar Ruta
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibleMapView;