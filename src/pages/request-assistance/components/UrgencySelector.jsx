import React from 'react';
import Icon from '../../../components/AppIcon';

const UrgencySelector = ({ selectedUrgency, onUrgencyChange, className = "" }) => {
  const urgencyLevels = [
    {
      id: 'low',
      title: 'Baja Prioridad',
      description: 'No es urgente, puede esperar hasta el siguiente día hábil',
      icon: 'Clock',
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600',
      estimatedTime: '2-4 horas',
      badge: 'bg-green-100 text-green-800'
    },
    {
      id: 'medium',
      title: 'Prioridad Media',
      description: 'Necesita atención dentro del día, pero no es crítico',
      icon: 'AlertCircle',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-600',
      estimatedTime: '30-60 min',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'high',
      title: 'Alta Prioridad',
      description: 'Requiere atención inmediata, afecta actividades importantes',
      icon: 'Zap',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      iconColor: 'text-orange-600',
      estimatedTime: '10-20 min',
      badge: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'critical',
      title: 'Crítico/Emergencia',
      description: 'Situación de emergencia que requiere respuesta inmediata',
      icon: 'AlertTriangle',
      color: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-600',
      estimatedTime: '< 5 min',
      badge: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nivel de Urgencia
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Indica qué tan urgente es tu solicitud para priorizar la respuesta
        </p>
      </div>
      <div className="space-y-3">
        {urgencyLevels?.map((level) => (
          <button
            key={level?.id}
            onClick={() => onUrgencyChange(level?.id)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${selectedUrgency === level?.id 
                ? `${level?.color} border-current shadow-md` 
                : 'bg-card border-border hover:border-muted-foreground hover:shadow-sm'
              }
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            `}
            role="radio"
            aria-checked={selectedUrgency === level?.id}
            aria-describedby={`${level?.id}-description`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`
                  p-2 rounded-lg
                  ${selectedUrgency === level?.id 
                    ? 'bg-white/20' :'bg-muted'
                  }
                `}>
                  <Icon 
                    name={level?.icon} 
                    size={20} 
                    className={selectedUrgency === level?.id ? level?.iconColor : 'text-muted-foreground'} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`
                      font-medium text-sm
                      ${selectedUrgency === level?.id ? 'text-current' : 'text-foreground'}
                    `}>
                      {level?.title}
                    </h4>
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${selectedUrgency === level?.id ? level?.badge : 'bg-muted text-muted-foreground'}
                    `}>
                      {level?.estimatedTime}
                    </span>
                  </div>
                  
                  <p 
                    id={`${level?.id}-description`}
                    className={`
                      text-xs leading-relaxed
                      ${selectedUrgency === level?.id ? 'text-current opacity-80' : 'text-muted-foreground'}
                    `}
                  >
                    {level?.description}
                  </p>
                </div>
              </div>

              {selectedUrgency === level?.id && (
                <div className="ml-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className={level?.iconColor} />
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      {/* Response Time Information */}
      {selectedUrgency && (
        <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-foreground mb-1">
                Tiempo de Respuesta Estimado
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Basado en el nivel de urgencia seleccionado y la disponibilidad actual del personal, 
                estimamos que recibirás una respuesta en aproximadamente{' '}
                <span className="font-medium text-foreground">
                  {urgencyLevels?.find(l => l?.id === selectedUrgency)?.estimatedTime}
                </span>.
              </p>
              
              {selectedUrgency === 'critical' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Para emergencias médicas, también llama al 911
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrgencySelector;