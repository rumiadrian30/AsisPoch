import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertBanner = ({ alerts, onDismiss, onViewAlternatives, onViewDetails }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  const mockAlerts = [
    {
      id: 1,
      type: 'hazard',
      severity: 'high',
      title: 'Ascensor Fuera de Servicio',
      message: 'El ascensor del Edificio B está temporalmente fuera de servicio. Se recomienda usar las escaleras del Edificio A o solicitar asistencia.',
      location: 'Edificio B - Planta Baja',
      affectedRoutes: ['Biblioteca', 'Laboratorios de Informática'],
      estimatedResolution: new Date(Date.now() + 7200000),
      hasAlternatives: true,
      actionRequired: true
    },
    {
      id: 2,
      type: 'construction',
      severity: 'medium',
      title: 'Trabajos de Mantenimiento',
      message: 'Mantenimiento programado en la rampa de acceso principal. Acceso disponible por entrada lateral.',
      location: 'Entrada Principal',
      affectedRoutes: ['Todas las rutas principales'],
      estimatedResolution: new Date(Date.now() + 3600000),
      hasAlternatives: true,
      actionRequired: false
    }
  ];

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'high':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error/30',
          textColor: 'text-error',
          iconColor: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'medium':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          textColor: 'text-warning',
          iconColor: 'text-warning',
          icon: 'AlertCircle'
        };
      case 'low':
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          textColor: 'text-primary',
          iconColor: 'text-primary',
          icon: 'Info'
        };
      default:
        return {
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          textColor: 'text-muted-foreground',
          iconColor: 'text-muted-foreground',
          icon: 'Bell'
        };
    }
  };

  const formatTimeRemaining = (timestamp) => {
    const diff = timestamp - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    onDismiss && onDismiss(alertId);
  };

  const visibleAlerts = mockAlerts?.filter(alert => !dismissedAlerts?.has(alert?.id));

  if (visibleAlerts?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {visibleAlerts?.map((alert) => {
        const config = getSeverityConfig(alert?.severity);
        
        return (
          <div
            key={alert?.id}
            className={`${config?.bgColor} ${config?.borderColor} border rounded-lg p-4 animate-slide-down`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start space-x-3">
              {/* Alert Icon */}
              <div className={`w-6 h-6 ${config?.iconColor} flex-shrink-0 mt-0.5`}>
                <Icon name={config?.icon} size={24} />
              </div>

              {/* Alert Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${config?.textColor} mb-1`}>
                      {alert?.title}
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {alert?.message}
                    </p>
                  </div>

                  {/* Dismiss Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => handleDismiss(alert?.id)}
                    className="ml-2 flex-shrink-0"
                    aria-label="Descartar alerta"
                  />
                </div>

                {/* Alert Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{alert?.location}</span>
                    </div>
                    
                    {alert?.estimatedResolution && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>
                          Resolución estimada: {formatTimeRemaining(alert?.estimatedResolution)}
                        </span>
                      </div>
                    )}
                  </div>

                  {alert?.affectedRoutes?.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Rutas afectadas:</span> {alert?.affectedRoutes?.join(', ')}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {alert?.hasAlternatives && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Navigation"
                      iconPosition="left"
                      onClick={() => onViewAlternatives && onViewAlternatives(alert)}
                    >
                      Ver Alternativas
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => onViewDetails && onViewDetails(alert)}
                  >
                    Más Detalles
                  </Button>

                  {alert?.actionRequired && (
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Phone"
                      iconPosition="left"
                      onClick={() => {
                        // Trigger emergency assistance
                        window.open('tel:+593-3-2998-200', '_self');
                      }}
                    >
                      Solicitar Ayuda
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertBanner;