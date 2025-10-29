import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const IncidentTypeSelector = ({ selectedTypes, onTypeChange, error }) => {
  const incidentTypes = [
    {
      id: 'physical-barriers',
      label: 'Barreras Físicas',
      description: 'Obstáculos que impiden el paso o acceso',
      icon: 'Construction',
      examples: ['Escalones sin rampa', 'Puertas estrechas', 'Superficies irregulares']
    },
    {
      id: 'equipment-failures',
      label: 'Fallas de Equipos',
      description: 'Equipos de accesibilidad fuera de servicio',
      icon: 'AlertTriangle',
      examples: ['Ascensores dañados', 'Rampas mecánicas', 'Sistemas de audio']
    },
    {
      id: 'safety-hazards',
      label: 'Riesgos de Seguridad',
      description: 'Condiciones peligrosas para la movilidad',
      icon: 'Shield',
      examples: ['Pisos mojados', 'Iluminación deficiente', 'Objetos sueltos']
    },
    {
      id: 'accessibility-issues',
      label: 'Problemas de Accesibilidad',
      description: 'Falta de características de accesibilidad',
      icon: 'Users',
      examples: ['Señalización inadecuada', 'Falta de audio', 'Contraste insuficiente']
    }
  ];

  const handleTypeToggle = (typeId) => {
    const updatedTypes = selectedTypes?.includes(typeId)
      ? selectedTypes?.filter(id => id !== typeId)
      : [...selectedTypes, typeId];
    onTypeChange(updatedTypes);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tipo de Incidente
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona uno o más tipos que describan mejor el incidente
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incidentTypes?.map((type) => (
          <div
            key={type?.id}
            className={`relative border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
              selectedTypes?.includes(type?.id)
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border bg-card hover:border-primary/50'
            }`}
            onClick={() => handleTypeToggle(type?.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedTypes?.includes(type?.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Icon name={type?.icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Checkbox
                    checked={selectedTypes?.includes(type?.id)}
                    onChange={() => handleTypeToggle(type?.id)}
                    className="pointer-events-none"
                  />
                  <h4 className="font-medium text-foreground">
                    {type?.label}
                  </h4>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {type?.description}
                </p>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Ejemplos:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {type?.examples?.map((example, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
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
    </div>
  );
};

export default IncidentTypeSelector;