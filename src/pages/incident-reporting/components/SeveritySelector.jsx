import React from 'react';
import Icon from '../../../components/AppIcon';

const SeveritySelector = ({ selectedSeverity, onSeverityChange, error }) => {
  const severityLevels = [
    {
      id: 'low',
      label: 'Baja',
      description: 'Inconveniente menor que no impide el acceso completamente',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      icon: 'Info',
      examples: ['Señalización poco clara', 'Iluminación reducida', 'Superficie ligeramente irregular'],
      urgency: 'Resolución en 3-5 días hábiles'
    },
    {
      id: 'medium',
      label: 'Media',
      description: 'Problema que dificulta significativamente el acceso',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      icon: 'AlertTriangle',
      examples: ['Rampa con pendiente excesiva', 'Puerta pesada', 'Obstáculo temporal'],
      urgency: 'Resolución en 1-2 días hábiles'
    },
    {
      id: 'high',
      label: 'Alta',
      description: 'Barrera que impide completamente el acceso',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
      icon: 'AlertCircle',
      examples: ['Ascensor fuera de servicio', 'Escalón sin rampa alternativa', 'Puerta bloqueada'],
      urgency: 'Resolución inmediata (mismo día)'
    },
    {
      id: 'critical',
      label: 'Crítica',
      description: 'Riesgo inmediato para la seguridad personal',
      color: 'text-destructive',
      bgColor: 'bg-destructive/20',
      borderColor: 'border-destructive',
      icon: 'ShieldAlert',
      examples: ['Piso mojado sin señalización', 'Escalón roto', 'Cable suelto'],
      urgency: 'Atención inmediata (menos de 1 hora)'
    }
  ];

  const handleSeveritySelect = (severityId) => {
    onSeverityChange(severityId);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nivel de Severidad
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Evalúa qué tan grave es el impacto del incidente en la accesibilidad
        </p>
      </div>
      <div className="space-y-3">
        {severityLevels?.map((level) => (
          <div
            key={level?.id}
            className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedSeverity === level?.id
                ? `${level?.borderColor} ${level?.bgColor} shadow-sm`
                : 'border-border bg-card hover:border-primary/50'
            }`}
            onClick={() => handleSeveritySelect(level?.id)}
          >
            <div className="flex items-start space-x-4">
              {/* Severity Icon */}
              <div className={`p-2 rounded-lg ${
                selectedSeverity === level?.id
                  ? 'bg-background' :'bg-muted'
              }`}>
                <Icon 
                  name={level?.icon} 
                  size={24} 
                  className={selectedSeverity === level?.id ? level?.color : 'text-muted-foreground'}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    selectedSeverity === level?.id ? level?.color : 'text-foreground'
                  }`}>
                    Severidad {level?.label}
                  </h4>
                  
                  {selectedSeverity === level?.id && (
                    <div className={`w-5 h-5 rounded-full ${level?.color?.replace('text-', 'bg-')} flex items-center justify-center`}>
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {level?.description}
                </p>

                {/* Urgency Timeline */}
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedSeverity === level?.id ? level?.bgColor : 'bg-muted'
                } ${selectedSeverity === level?.id ? level?.color : 'text-muted-foreground'}`}>
                  <Icon name="Clock" size={12} />
                  <span>{level?.urgency}</span>
                </div>

                {/* Examples */}
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Ejemplos comunes:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    {level?.examples?.map((example, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </div>
      )}
      {selectedSeverity && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                Recomendación para Severidad {severityLevels?.find(l => l?.id === selectedSeverity)?.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedSeverity === 'critical' && 'Considera contactar también al personal de seguridad del campus para atención inmediata.'
                }
                {selectedSeverity === 'high' && 'Incluye fotos detalladas y ubicación precisa para acelerar la resolución.'
                }
                {selectedSeverity === 'medium' && 'Proporciona alternativas temporales si las conoces para ayudar a otros usuarios.'
                }
                {selectedSeverity === 'low' && 'Tu reporte ayudará a mejorar la accesibilidad general del campus.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeveritySelector;