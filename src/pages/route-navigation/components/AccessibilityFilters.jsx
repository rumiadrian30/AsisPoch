import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccessibilityFilters = ({ 
  onFiltersChange, 
  initialFilters = {},
  isCollapsed = false,
  onToggleCollapse 
}) => {
  const [filters, setFilters] = useState({
    wheelchairAccessible: false,
    visualGuidance: false,
    hearingAssistance: false,
    cognitiveSupport: false,
    avoidStairs: false,
    wellLitPaths: false,
    smoothSurfaces: false,
    restAreas: false,
    ...initialFilters
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Filter options with Spanish labels and descriptions
  const filterOptions = [
    {
      key: 'wheelchairAccessible',
      label: 'Accesible en Silla de Ruedas',
      description: 'Rutas con rampas y superficies lisas',
      icon: 'Accessibility',
      category: 'mobility'
    },
    {
      key: 'visualGuidance',
      label: 'Guía Visual',
      description: 'Señalización táctil y auditiva',
      icon: 'Eye',
      category: 'visual'
    },
    {
      key: 'hearingAssistance',
      label: 'Asistencia Auditiva',
      description: 'Alertas visuales y vibraciones',
      icon: 'Ear',
      category: 'hearing'
    },
    {
      key: 'cognitiveSupport',
      label: 'Apoyo Cognitivo',
      description: 'Instrucciones simplificadas',
      icon: 'Brain',
      category: 'cognitive'
    },
    {
      key: 'avoidStairs',
      label: 'Evitar Escaleras',
      description: 'Solo rutas con rampas o ascensores',
      icon: 'ArrowUp',
      category: 'mobility'
    },
    {
      key: 'wellLitPaths',
      label: 'Senderos Bien Iluminados',
      description: 'Rutas con iluminación adecuada',
      icon: 'Lightbulb',
      category: 'visual'
    },
    {
      key: 'smoothSurfaces',
      label: 'Superficies Lisas',
      description: 'Evitar terrenos irregulares',
      icon: 'Square',
      category: 'mobility'
    },
    {
      key: 'restAreas',
      label: 'Áreas de Descanso',
      description: 'Rutas con bancos y zonas de parada',
      icon: 'Armchair',
      category: 'general'
    }
  ];

  // Group filters by category
  const filtersByCategory = {
    mobility: filterOptions?.filter(f => f?.category === 'mobility'),
    visual: filterOptions?.filter(f => f?.category === 'visual'),
    hearing: filterOptions?.filter(f => f?.category === 'hearing'),
    cognitive: filterOptions?.filter(f => f?.category === 'cognitive'),
    general: filterOptions?.filter(f => f?.category === 'general')
  };

  const categoryLabels = {
    mobility: 'Movilidad',
    visual: 'Visual',
    hearing: 'Auditiva',
    cognitive: 'Cognitiva',
    general: 'General'
  };

  // Update active filters count
  useEffect(() => {
    const count = Object.values(filters)?.filter(Boolean)?.length;
    setActiveFiltersCount(count);
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (filterKey, checked) => {
    const newFilters = {
      ...filters,
      [filterKey]: checked
    };
    setFilters(newFilters);
    
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = Object.keys(filters)?.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setFilters(clearedFilters);
    
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  // Apply common accessibility presets
  const applyPreset = (presetType) => {
    let presetFilters = { ...filters };
    
    // Clear all first
    Object.keys(presetFilters)?.forEach(key => {
      presetFilters[key] = false;
    });

    switch (presetType) {
      case 'wheelchair':
        presetFilters = {
          ...presetFilters,
          wheelchairAccessible: true,
          avoidStairs: true,
          smoothSurfaces: true,
          restAreas: true
        };
        break;
      case 'visual':
        presetFilters = {
          ...presetFilters,
          visualGuidance: true,
          wellLitPaths: true,
          cognitiveSupport: true
        };
        break;
      case 'hearing':
        presetFilters = {
          ...presetFilters,
          hearingAssistance: true,
          visualGuidance: true
        };
        break;
      default:
        break;
    }

    setFilters(presetFilters);
    if (onFiltersChange) {
      onFiltersChange(presetFilters);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={18} className="text-muted-foreground" />
            <h3 className="font-semibold text-foreground">
              Filtros de Accesibilidad
            </h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                iconName="X"
                iconPosition="left"
                iconSize={14}
              >
                Limpiar
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expandir filtros" : "Contraer filtros"}
            >
              <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={18} />
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-6">
          {/* Quick Presets */}
          <div>
            <h4 className="font-medium text-sm text-foreground mb-3">
              Configuraciones Rápidas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('wheelchair')}
                iconName="Accessibility"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Silla de Ruedas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('visual')}
                iconName="Eye"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Discapacidad Visual
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('hearing')}
                iconName="Ear"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Discapacidad Auditiva
              </Button>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="space-y-4">
            {Object.entries(filtersByCategory)?.map(([category, categoryFilters]) => (
              categoryFilters?.length > 0 && (
                <div key={category}>
                  <h4 className="font-medium text-sm text-foreground mb-3">
                    {categoryLabels?.[category]}
                  </h4>
                  <div className="space-y-3">
                    {categoryFilters?.map((filter) => (
                      <div key={filter?.key} className="flex items-start space-x-3">
                        <Checkbox
                          checked={filters?.[filter?.key]}
                          onChange={(e) => handleFilterChange(filter?.key, e?.target?.checked)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Icon name={filter?.icon} size={14} className="text-muted-foreground" />
                            <label className="text-sm font-medium text-foreground cursor-pointer">
                              {filter?.label}
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {filter?.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={16} className="text-primary" />
                <span className="font-medium text-sm text-primary">
                  Filtros Activos ({activeFiltersCount})
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(filters)?.filter(([_, isActive]) => isActive)?.map(([key, _]) => {
                    const filter = filterOptions?.find(f => f?.key === key);
                    return filter ? (
                      <span
                        key={key}
                        className="px-2 py-1 bg-primary/20 text-primary text-xs rounded flex items-center space-x-1"
                      >
                        <Icon name={filter?.icon} size={10} />
                        <span>{filter?.label}</span>
                      </span>
                    ) : null;
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccessibilityFilters;