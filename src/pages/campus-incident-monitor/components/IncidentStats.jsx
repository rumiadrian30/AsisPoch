import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const IncidentStats = ({ incidents }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('incidents');

  // Calculate statistics
  const totalIncidents = incidents?.length;
  const activeIncidents = incidents?.filter(i => i?.status === 'active')?.length;
  const resolvedIncidents = incidents?.filter(i => i?.status === 'resolved')?.length;
  const criticalIncidents = incidents?.filter(i => i?.severity === 'critical')?.length;

  // Calculate resolution rate
  const resolutionRate = totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0;

  // Calculate average resolution time (mock data)
  const avgResolutionTime = "2.5 horas";

  // Prepare chart data
  const severityData = [
    { name: 'Crítico', value: incidents?.filter(i => i?.severity === 'critical')?.length, color: '#DC2626' },
    { name: 'Alto', value: incidents?.filter(i => i?.severity === 'high')?.length, color: '#F59E0B' },
    { name: 'Medio', value: incidents?.filter(i => i?.severity === 'medium')?.length, color: '#3B82F6' },
    { name: 'Bajo', value: incidents?.filter(i => i?.severity === 'low')?.length, color: '#10B981' }
  ];

  const statusData = [
    { name: 'Activo', value: activeIncidents, color: '#F59E0B' },
    { name: 'En Progreso', value: incidents?.filter(i => i?.status === 'in-progress')?.length, color: '#3B82F6' },
    { name: 'Resuelto', value: resolvedIncidents, color: '#10B981' },
    { name: 'Cerrado', value: incidents?.filter(i => i?.status === 'closed')?.length, color: '#6B7280' }
  ];

  const trendData = [
    { name: 'Lun', incidents: 12, resolved: 8 },
    { name: 'Mar', incidents: 15, resolved: 12 },
    { name: 'Mié', incidents: 8, resolved: 10 },
    { name: 'Jue', incidents: 18, resolved: 14 },
    { name: 'Vie', incidents: 22, resolved: 16 },
    { name: 'Sáb', incidents: 6, resolved: 8 },
    { name: 'Dom', incidents: 4, resolved: 5 }
  ];

  const departmentData = [
    { name: 'Mantenimiento', incidents: 25, resolved: 20 },
    { name: 'Seguridad', incidents: 18, resolved: 15 },
    { name: 'Inclusión', incidents: 12, resolved: 10 },
    { name: 'Instalaciones', incidents: 8, resolved: 6 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Incidentes</p>
              <p className="text-2xl font-bold text-foreground">{totalIncidents}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-primary" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Icon name="TrendingUp" size={14} className="text-success mr-1" />
            <span className="text-success">+12%</span>
            <span className="text-muted-foreground ml-1">vs semana anterior</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold text-warning">{activeIncidents}</p>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-warning" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Icon name="TrendingDown" size={14} className="text-success mr-1" />
            <span className="text-success">-8%</span>
            <span className="text-muted-foreground ml-1">vs semana anterior</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasa Resolución</p>
              <p className="text-2xl font-bold text-success">{resolutionRate}%</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Icon name="TrendingUp" size={14} className="text-success mr-1" />
            <span className="text-success">+5%</span>
            <span className="text-muted-foreground ml-1">vs semana anterior</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-foreground">{avgResolutionTime}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Timer" size={20} className="text-primary" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Icon name="TrendingDown" size={14} className="text-success mr-1" />
            <span className="text-success">-15min</span>
            <span className="text-muted-foreground ml-1">vs semana anterior</span>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Distribución por Severidad
            </h3>
            <div className="flex items-center space-x-2">
              <Icon name="PieChart" size={16} className="text-muted-foreground" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {severityData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground">{item?.name}</span>
                <span className="text-sm font-medium text-foreground">{item?.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Estado de Incidentes
            </h3>
            <div className="flex items-center space-x-2">
              <Icon name="BarChart3" size={16} className="text-muted-foreground" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Tendencia Semanal
            </h3>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e?.target?.value)}
                className="text-sm border border-border rounded px-2 py-1 bg-background"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
                <option value="quarter">Este Trimestre</option>
              </select>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  name="Reportados"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Resueltos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Rendimiento por Departamento
            </h3>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  width={80}
                />
                <Tooltip />
                <Bar dataKey="incidents" fill="#F59E0B" radius={[0, 4, 4, 0]} name="Asignados" />
                <Bar dataKey="resolved" fill="#10B981" radius={[0, 4, 4, 0]} name="Resueltos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Critical Incidents Alert */}
      {criticalIncidents > 0 && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-error" />
            <div>
              <h4 className="font-medium text-error">
                Incidentes Críticos Pendientes
              </h4>
              <p className="text-sm text-error/80">
                Hay {criticalIncidents} incidente(s) crítico(s) que requieren atención inmediata.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentStats;