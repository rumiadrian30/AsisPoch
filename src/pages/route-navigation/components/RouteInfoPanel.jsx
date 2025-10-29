import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RouteInfoPanel = ({ 
  selectedRoute, 
  isVoiceEnabled, 
  onVoiceToggle, 
  onStartNavigation,
  incidents = [],
  currentStep = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [navigationStarted, setNavigationStarted] = useState(false);

  // Mock step-by-step directions in Spanish
  const mockDirections = [
    {
      id: 1,
      instruction: "Salga del edificio principal por la puerta sur",
      distance: "0m",
      duration: "0 min",
      accessibility: "Puerta automática disponible",
      landmark: "Edificio de Administración"
    },
    {
      id: 2,
      instruction: "Continúe recto por el sendero pavimentado",
      distance: "120m",
      duration: "2 min",
      accessibility: "Superficie lisa, rampa suave",
      landmark: "Jardín Central"
    },
    {
      id: 3,
      instruction: "Gire a la izquierda hacia el edificio de Ciencias",
      distance: "200m",
      duration: "3 min",
      accessibility: "Señalización táctil disponible",
      landmark: "Fuente Principal"
    },
    {
      id: 4,
      instruction: "Suba por la rampa de acceso",
      distance: "130m",
      duration: "1 min",
      accessibility: "Rampa con pasamanos, pendiente 5%",
      landmark: "Edificio de Ciencias"
    }
  ];

  // Handle voice navigation toggle
  const handleVoiceToggle = () => {
    if (onVoiceToggle) {
      onVoiceToggle(!isVoiceEnabled);
    }
  };

  // Handle navigation start
  const handleStartNavigation = () => {
    setNavigationStarted(true);
    if (onStartNavigation) {
      onStartNavigation(selectedRoute);
    }
  };

  // Get accessibility level color and icon
  const getAccessibilityInfo = (level) => {
    switch (level) {
      case 'high':
        return { color: 'text-success', icon: 'CheckCircle', label: 'Totalmente Accesible' };
      case 'medium':
        return { color: 'text-warning', icon: 'AlertCircle', label: 'Parcialmente Accesible' };
      case 'low':
        return { color: 'text-error', icon: 'XCircle', label: 'Accesibilidad Limitada' };
      default:
        return { color: 'text-muted-foreground', icon: 'HelpCircle', label: 'Sin Información' };
    }
  };

  if (!selectedRoute) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">
          Selecciona una Ruta
        </h3>
        <p className="text-sm text-muted-foreground">
          Elige un destino en el mapa para ver las direcciones detalladas y comenzar la navegación.
        </p>
      </div>
    );
  }

  const accessibilityInfo = getAccessibilityInfo(selectedRoute?.accessibilityLevel);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">
            {selectedRoute?.name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Contraer panel" : "Expandir panel"}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={18} />
          </Button>
        </div>

        {/* Route Summary */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="MapPin" size={14} />
              <span>{selectedRoute?.distance}</span>
            </span>
            <span className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>{selectedRoute?.duration}</span>
            </span>
          </div>
          
          <div className={`flex items-center space-x-1 ${accessibilityInfo?.color}`}>
            <Icon name={accessibilityInfo?.icon} size={14} />
            <span className="text-xs font-medium">
              {accessibilityInfo?.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant={navigationStarted ? "outline" : "default"}
            onClick={handleStartNavigation}
            iconName={navigationStarted ? "Square" : "Play"}
            iconPosition="left"
            className="flex-1"
          >
            {navigationStarted ? "Detener" : "Iniciar Navegación"}
          </Button>
          
          <Button
            variant={isVoiceEnabled ? "default" : "outline"}
            onClick={handleVoiceToggle}
            iconName={isVoiceEnabled ? "VolumeX" : "Volume2"}
            size="icon"
            aria-label={isVoiceEnabled ? "Desactivar voz" : "Activar voz"}
          />
        </div>
      </div>
      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Accessibility Features */}
          <div>
            <h4 className="font-medium text-sm text-foreground mb-2">
              Características de Accesibilidad
            </h4>
            <div className="space-y-1">
              {selectedRoute?.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Icon name="Check" size={12} className="text-success" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Alerts */}
          {incidents?.length > 0 && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="font-medium text-sm text-warning">
                  Alertas en la Ruta
                </span>
              </div>
              {incidents?.slice(0, 2)?.map((incident, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  • {incident?.description || "Obstáculo temporal reportado"}
                </p>
              ))}
            </div>
          )}

          {/* Step-by-Step Directions */}
          <div>
            <h4 className="font-medium text-sm text-foreground mb-3">
              Direcciones Paso a Paso
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mockDirections?.map((step, index) => (
                <div
                  key={step?.id}
                  className={`p-3 rounded-lg border transition-all ${
                    navigationStarted && index === currentStep
                      ? 'border-primary bg-primary/5' :'border-border bg-background'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      navigationStarted && index === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : index < currentStep
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {navigationStarted && index === currentStep ? (
                        <Icon name="Navigation" size={12} />
                      ) : index < currentStep ? (
                        <Icon name="Check" size={12} />
                      ) : (
                        step?.id
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium mb-1">
                        {step?.instruction}
                      </p>
                      
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
                        <span>{step?.distance}</span>
                        <span>•</span>
                        <span>{step?.duration}</span>
                        <span>•</span>
                        <span>{step?.landmark}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs">
                        <Icon name="Shield" size={10} className="text-success" />
                        <span className="text-success">{step?.accessibility}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Instructions Status */}
          {isVoiceEnabled && navigationStarted && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  Instrucciones de voz activadas
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Recibirás indicaciones por voz y vibraciones durante la navegación.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteInfoPanel;