import React from 'react';
import Icon from '../../../components/AppIcon';

const AssistanceTypeSelector = ({ selectedType, onTypeChange, className = "" }) => {
  const assistanceTypes = [
    {
      id: 'mobility',
      title: 'Asistencia de Movilidad',
      description: 'Ayuda con desplazamiento, acceso a edificios, o navegación en el campus',
      icon: 'Accessibility',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-600'
    },
    {
      id: 'academic',
      title: 'Apoyo Académico',
      description: 'Asistencia con materiales, tecnología adaptativa, o servicios educativos',
      icon: 'BookOpen',
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600'
    },
    {
      id: 'wellness',
      title: 'Bienestar y Salud',
      description: 'Apoyo psicológico, servicios médicos, o asistencia de bienestar',
      icon: 'Heart',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      iconColor: 'text-purple-600'
    },
    {
      id: 'emergency',
      title: 'Emergencia',
      description: 'Situaciones urgentes que requieren atención inmediata',
      icon: 'AlertTriangle',
      color: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tipo de Asistencia
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona el tipo de ayuda que necesitas
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assistanceTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => onTypeChange(type?.id)}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${selectedType === type?.id 
                ? `${type?.color} border-current shadow-md` 
                : 'bg-card border-border hover:border-muted-foreground hover:shadow-sm'
              }
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            `}
            role="radio"
            aria-checked={selectedType === type?.id}
            aria-describedby={`${type?.id}-description`}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                p-2 rounded-lg
                ${selectedType === type?.id 
                  ? 'bg-white/20' :'bg-muted'
                }
              `}>
                <Icon 
                  name={type?.icon} 
                  size={24} 
                  className={selectedType === type?.id ? type?.iconColor : 'text-muted-foreground'} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`
                  font-medium text-sm mb-1
                  ${selectedType === type?.id ? 'text-current' : 'text-foreground'}
                `}>
                  {type?.title}
                </h4>
                <p 
                  id={`${type?.id}-description`}
                  className={`
                    text-xs leading-relaxed
                    ${selectedType === type?.id ? 'text-current opacity-80' : 'text-muted-foreground'}
                  `}
                >
                  {type?.description}
                </p>
              </div>
            </div>

            {selectedType === type?.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <Icon name="Check" size={14} className={type?.iconColor} />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssistanceTypeSelector;