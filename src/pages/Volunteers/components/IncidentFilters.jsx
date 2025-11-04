import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const IncidentFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'closed', label: 'Cerrado' }
  ];

  const severityOptions = [
    { value: 'all', label: 'Todas las severidades' },
    { value: 'critical', label: 'Crítico' },
    { value: 'high', label: 'Alto' },
    { value: 'medium', label: 'Medio' },
    { value: 'low', label: 'Bajo' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'accessibility', label: 'Accesibilidad' },
    { value: 'infrastructure', label: 'Infraestructura' },
    { value: 'safety', label: 'Seguridad' },
    { value: 'maintenance', label: 'Mantenimiento' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'Todos los departamentos' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'security', label: 'Seguridad' },
    { value: 'accessibility', label: 'Oficina de Inclusión' },
    { value: 'facilities', label: 'Instalaciones' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (key, value) => {
    const newDateRange = {
      ...dateRange,
      [key]: value
    };
    setDateRange(newDateRange);
    
    onFiltersChange({
      ...filters,
      dateRange: newDateRange
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.status && filters?.status !== 'all') count++;
    if (filters?.severity && filters?.severity !== 'all') count++;
    if (filters?.type && filters?.type !== 'all') count++;
    if (filters?.department && filters?.department !== 'all') count++;
    if (filters?.location) count++;
    if (dateRange?.startDate || dateRange?.endDate) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center space-x-3">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Filtros
          </h3>
          {getActiveFiltersCount() > 0 && (
            <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            className="px-3"
          >
            Limpiar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            className="w-8 h-8"
          />
        </div>
      </div>
      {/* Quick Filters */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Estado
            </label>
            <select
              value={filters?.status || 'all'}
              onChange={(e) => handleFilterChange('status', e?.target?.value)}
              className="w-full text-sm border border-border rounded px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Severidad
            </label>
            <select
              value={filters?.severity || 'all'}
              onChange={(e) => handleFilterChange('severity', e?.target?.value)}
              className="w-full text-sm border border-border rounded px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {severityOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tipo
            </label>
            <select
              value={filters?.type || 'all'}
              onChange={(e) => handleFilterChange('type', e?.target?.value)}
              className="w-full text-sm border border-border rounded px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {typeOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Search */}
          <div>
            <Input
              label="Ubicación"
              type="text"
              placeholder="Buscar ubicación..."
              value={filters?.location || ''}
              onChange={(e) => handleFilterChange('location', e?.target?.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 bg-muted/30 animate-slide-down">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Range */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Rango de Fechas</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Fecha Inicio"
                  type="date"
                  value={dateRange?.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e?.target?.value)}
                />
                <Input
                  label="Fecha Fin"
                  type="date"
                  value={dateRange?.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e?.target?.value)}
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Departamento Asignado</h4>
              <select
                value={filters?.department || 'all'}
                onChange={(e) => handleFilterChange('department', e?.target?.value)}
                className="w-full text-sm border border-border rounded px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {departmentOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Impact Level */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Nivel de Impacto</h4>
              <div className="space-y-2">
                {['major', 'moderate', 'minor']?.map(impact => (
                  <label key={impact} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters?.impact?.includes(impact) || false}
                      onChange={(e) => {
                        const currentImpact = filters?.impact || [];
                        const newImpact = e?.target?.checked
                          ? [...currentImpact, impact]
                          : currentImpact?.filter(i => i !== impact);
                        handleFilterChange('impact', newImpact);
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground capitalize">
                      {impact === 'major' ? 'Mayor' : impact === 'moderate' ? 'Moderado' : 'Menor'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reporter Type */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Tipo de Reportero</h4>
              <div className="space-y-2">
                {['student', 'staff', 'visitor']?.map(reporterType => (
                  <label key={reporterType} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters?.reporterType?.includes(reporterType) || false}
                      onChange={(e) => {
                        const currentTypes = filters?.reporterType || [];
                        const newTypes = e?.target?.checked
                          ? [...currentTypes, reporterType]
                          : currentTypes?.filter(t => t !== reporterType);
                        handleFilterChange('reporterType', newTypes);
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground capitalize">
                      {reporterType === 'student' ? 'Estudiante' : 
                       reporterType === 'staff' ? 'Personal' : 'Visitante'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {getActiveFiltersCount()} filtro(s) activo(s)
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                iconName="RotateCcw"
                iconPosition="left"
                className="px-4"
              >
                Restablecer
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Search"
                iconPosition="left"
                className="px-4"
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentFilters;