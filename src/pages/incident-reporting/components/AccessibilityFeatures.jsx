import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AccessibilityFeatures = ({ selectedFeatures, onFeaturesChange, error }) => {
  const accessibilityFeatures = [
    {
      id: 'ramps',
      label: 'Rampas de Acceso',
      description: 'Rampas para sillas de ruedas y movilidad reducida',
      icon: 'TrendingUp',
      category: 'mobility',
      examples: ['Pendiente inadecuada', 'Superficie resbaladiza', 'Falta de pasamanos']
    },
    {
      id: 'elevators',
      label: 'Ascensores',
      description: 'Sistemas de elevación vertical',
      icon: 'ArrowUpDown',
      category: 'mobility',
      examples: ['Fuera de servicio', 'Botones no funcionan', 'Puertas no abren']
    },
    {
      id: 'lighting',
      label: 'Iluminación',
      description: 'Sistemas de iluminación adecuada',
      icon: 'Lightbulb',
      category: 'visual',
      examples: ['Luces fundidas', 'Iluminación insuficiente', 'Deslumbramiento']
    },
    {
      id: 'signage',
      label: 'Señalización',
      description: 'Señales visuales y táctiles',
      icon: 'SignPost',
      category: 'visual',
      examples: ['Señales poco visibles', 'Falta braille', 'Información incorrecta']
    },
    {
      id: 'audio-systems',
      label: 'Sistemas de Audio',
      description: 'Anuncios y alertas sonoras',
      icon: 'Volume2',
      category: 'hearing',
      examples: ['Audio no funciona', 'Volumen inadecuado', 'Calidad deficiente']
    },
    {
      id: 'tactile-paths',
      label: 'Senderos Táctiles',
      description: 'Guías táctiles para personas con discapacidad visual',
      icon: 'Navigation',
      category: 'visual',
      examples: ['Sendero interrumpido', 'Textura desgastada', 'Obstáculos en el camino']
    },
    {
      id: 'handrails',
      label: 'Pasamanos',
      description: 'Barandillas y apoyos de seguridad',
      icon: 'Minus',
      category: 'mobility',
      examples: ['Pasamanos sueltos', 'Altura inadecuada', 'Falta de continuidad']
    },
    {
      id: 'doors',
      label: 'Puertas Accesibles',
      description: 'Puertas automáticas y de fácil apertura',
      icon: 'DoorOpen',
      category: 'mobility',
      examples: ['Muy pesadas', 'Automático no funciona', 'Ancho insuficiente']
    },
    {
      id: 'restrooms',
      label: 'Baños Accesibles',
      description: 'Instalaciones sanitarias adaptadas',
      icon: 'Home',
      category: 'mobility',
      examples: ['Espacio insuficiente', 'Barras de apoyo rotas', 'Puerta no abre']
    },
    {
      id: 'parking',
      label: 'Estacionamiento',
      description: 'Espacios de estacionamiento reservados',
      icon: 'Car',
      category: 'mobility',
      examples: ['Espacios ocupados', 'Señalización borrada', 'Acceso bloqueado']
    },
    {
      id: 'emergency-systems',
      label: 'Sistemas de Emergencia',
      description: 'Alertas y evacuación accesible',
      icon: 'AlertTriangle',
      category: 'safety',
      examples: ['Alarmas solo sonoras', 'Rutas no señalizadas', 'Falta información visual']
    },
    {
      id: 'technology',
      label: 'Tecnología Asistiva',
      description: 'Dispositivos y sistemas de apoyo',
      icon: 'Smartphone',
      category: 'technology',
      examples: ['Pantallas no funcionan', 'Software desactualizado', 'Interfaz inaccesible']
    }
  ];

  const categories = {
    mobility: { label: 'Movilidad', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    visual: { label: 'Visual', color: 'text-green-600', bgColor: 'bg-green-50' },
    hearing: { label: 'Auditiva', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    safety: { label: 'Seguridad', color: 'text-red-600', bgColor: 'bg-red-50' },
    technology: { label: 'Tecnología', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  };

  const handleFeatureToggle = (featureId) => {
    const updatedFeatures = selectedFeatures?.includes(featureId)
      ? selectedFeatures?.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    onFeaturesChange(updatedFeatures);
  };

  const groupedFeatures = accessibilityFeatures?.reduce((acc, feature) => {
    if (!acc?.[feature?.category]) {
      acc[feature.category] = [];
    }
    acc?.[feature?.category]?.push(feature);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Características de Accesibilidad Afectadas
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona las características de accesibilidad que están relacionadas con este incidente
        </p>
      </div>
      {Object.entries(groupedFeatures)?.map(([categoryKey, features]) => {
        const category = categories?.[categoryKey];
        return (
          <div key={categoryKey} className="space-y-3">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${category?.bgColor}`}>
              <div className={`w-2 h-2 rounded-full ${category?.color?.replace('text-', 'bg-')}`} />
              <span className={`text-sm font-medium ${category?.color}`}>
                {category?.label}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features?.map((feature) => (
                <div
                  key={feature?.id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                    selectedFeatures?.includes(feature?.id)
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  onClick={() => handleFeatureToggle(feature?.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedFeatures?.includes(feature?.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name={feature?.icon} size={18} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Checkbox
                          checked={selectedFeatures?.includes(feature?.id)}
                          onChange={() => handleFeatureToggle(feature?.id)}
                          className="pointer-events-none"
                        />
                        <h4 className="font-medium text-foreground text-sm">
                          {feature?.label}
                        </h4>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {feature?.description}
                      </p>
                      
                      {selectedFeatures?.includes(feature?.id) && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Problemas comunes:
                          </p>
                          <div className="space-y-0.5">
                            {feature?.examples?.map((example, index) => (
                              <div key={index} className="flex items-center space-x-1">
                                <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                                <span className="text-xs text-muted-foreground">{example}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {selectedFeatures?.length > 0 && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                Características Seleccionadas: {selectedFeatures?.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Esta información ayudará al equipo de mantenimiento a priorizar la reparación 
                y asignar los recursos adecuados para restaurar la accesibilidad.
              </p>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default AccessibilityFeatures;