import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import IncidentMap from './components/IncidentMap';
import IncidentList from './components/IncidentList';
import IncidentFilters from './components/IncidentFilters';
import IncidentStats from './components/IncidentStats';
import Button from '../../components/ui/Button';
import { ApiService } from '../../services/apiService';
import Icon from '../../components/AppIcon';

const CampusIncidentMonitor = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    type: 'all',
    location: '',
    department: 'all'
  });
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para incidentes reales desde la base de datos
  const [incidents, setIncidents] = useState([]);

  // Cargar incidentes desde la base de datos
  useEffect(() => {
    loadIncidentsFromDatabase();
  }, []);

  // Función para cargar incidentes desde la base de datos
  const loadIncidentsFromDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📥 Cargando incidentes desde la base de datos...');
      const result = await ApiService.getAllIncidents();
      
      if (result.success) {
        console.log(`✅ Se cargaron ${result.data.length} incidentes desde la BD`);
        setIncidents(result.data);
      } else {
        throw new Error(result.error || 'Error al cargar incidentes');
      }
    } catch (error) {
      console.error('❌ Error cargando incidentes:', error);
      setError('No se pudieron cargar los incidentes. ' + error.message);
      
      // Datos de respaldo en caso de error
      setIncidents(getBackupIncidents());
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  // Datos de respaldo en caso de que falle la conexión a la BD
  const getBackupIncidents = () => {
    return [
      {
        id: 1,
        title: 'Rampa de acceso bloqueada en Edificio A',
        description: 'La rampa principal de acceso para sillas de ruedas está obstruida por trabajos de construcción.',
        severity: 'critical',
        status: 'active',
        location_building: 'Edificio A',
        reporter_full_name: 'Rumi Grefa',
        reported_at: new Date().toISOString(),
        affected_users: 15,
        route_impact: 'major',
        estimated_resolution: '4-6 horas'
      }
    ];
  };

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'disconnected');
      // Actualizar datos cada 30 segundos
      loadIncidentsFromDatabase();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle incident selection
  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
  };

  // Handle status updates
  const handleStatusUpdate = async (incidentId, newStatus) => {
    try {
      // Actualizar en la base de datos
      if (import.meta.env.VITE_API_URL) {
        await ApiService.updateIncidentStatus(incidentId, newStatus);
      }
      
      // Actualizar estado local
      setIncidents((prev) => prev?.map((incident) =>
        incident?.id === incidentId ?
        { 
          ...incident, 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        } :
        incident
      ));
      
      console.log(`✅ Estado actualizado: ${incidentId} -> ${newStatus}`);
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
    }
  };

  // Handle incident assignment
  const handleAssignIncident = async (incidentId, assignedTo) => {
    try {
      // Actualizar en la base de datos
      if (import.meta.env.VITE_API_URL) {
        await ApiService.assignIncident(incidentId, assignedTo);
      }
      
      // Actualizar estado local
      setIncidents((prev) => prev?.map((incident) =>
        incident?.id === incidentId ?
        { 
          ...incident, 
          assigned_to: assignedTo,
          updated_at: new Date().toISOString() 
        } :
        incident
      ));
      
      console.log(`✅ Incidente asignado: ${incidentId} -> ${assignedTo}`);
    } catch (error) {
      console.error('❌ Error asignando incidente:', error);
    }
  };

  // Handle adding comments
  const handleAddComment = async (incidentId, commentText) => {
    try {
      // Agregar a la base de datos
      if (import.meta.env.VITE_API_URL) {
        await ApiService.addComment(incidentId, commentText, 'Administrador');
      }
      
      console.log(`✅ Comentario agregado al incidente: ${incidentId}`);
    } catch (error) {
      console.error('❌ Error agregando comentario:', error);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      severity: 'all',
      type: 'all',
      location: '',
      department: 'all'
    });
  };

  // Filter incidents based on current filters
  const filteredIncidents = incidents?.filter((incident) => {
    if (filters?.status && filters?.status !== 'all' && incident?.status !== filters?.status) return false;
    if (filters?.severity && filters?.severity !== 'all' && incident?.severity !== filters?.severity) return false;
    if (filters?.type && filters?.type !== 'all' && incident?.type !== filters?.type) return false;
    if (filters?.location && !incident?.location_building?.toLowerCase()?.includes(filters?.location?.toLowerCase())) return false;
    // Filtro por estado de voluntarios
    if (filters.volunteerStatus === 'with_volunteers' && incident.current_volunteers === 0) return false;
    if (filters.volunteerStatus === 'without_volunteers' && incident.current_volunteers > 0) return false;
    if (filters.volunteerStatus === 'needs_volunteers' && 
        (!incident.volunteers_needed || incident.current_volunteers >= incident.volunteers_needed)) return false;
    return true;
  });

  // Handle emergency request
  const handleEmergencyRequest = () => {
    navigate('/request-assistance', { state: { emergency: true } });
  };

  // Handle role switching
  const handleRoleSwitch = (newRole) => {
    console.log('Switching to role:', newRole);
  };

  // Refresh incidents manually
  const handleRefresh = () => {
    loadIncidentsFromDatabase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="admin"
        onEmergencyRequest={handleEmergencyRequest}
        onRoleSwitch={handleRoleSwitch} />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Monitor de Incidentes del Campus
            </h1>
            <p className="text-muted-foreground">
              Supervisión integral de barreras de accesibilidad y riesgos de movilidad reportados
            </p>
            
            {/* Estado de carga */}
            {loading && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-primary">
                <Icon name="Refresh" size={16} className="animate-spin" />
                <span>Cargando incidentes desde la base de datos...</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-destructive">
                <Icon name="AlertTriangle" size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-success' : 'bg-error'
              }`} />
              <span className="text-sm font-caption text-muted-foreground">
                {connectionStatus === 'connected' ? 'En línea' : 'Desconectado'}
              </span>
              <span className="text-xs text-muted-foreground">
                {lastUpdate?.toLocaleTimeString('es-ES')}
              </span>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              loading={loading}
              iconName="Refresh"
              className="px-3"
            >
              Actualizar
            </Button>

            {/* View Toggle */}
            <div className="flex bg-muted border border-border rounded-lg p-1">
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('dashboard')}
                iconName="LayoutDashboard"
                iconPosition="left"
                className="px-3"
              >
                Panel
              </Button>
              <Button
                variant={activeView === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('map')}
                iconName="Map"
                iconPosition="left"
                className="px-3"
              >
                Mapa
              </Button>
              <Button
                variant={activeView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('list')}
                iconName="List"
                iconPosition="left"
                className="px-3"
              >
                Lista
              </Button>
            </div>
          </div>
        </div>

        {/* Información de la base de datos */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-primary" />
                <span className="text-foreground font-medium">
                  Base de Datos PostgreSQL
                </span>
              </div>
              <div className="text-muted-foreground">
                {incidents.length} incidentes cargados
              </div>
              <div className="text-muted-foreground">
                Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('http://localhost:5000/api/debug/incidents', '_blank')}
              iconName="ExternalLink"
              className="text-xs"
            >
              Ver en API
            </Button>
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics */}
            <IncidentStats incidents={filteredIncidents} />

            {/* Filters */}
            <IncidentFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />

            {/* Dual Panel Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-96">
              {/* Map Panel */}
              <IncidentMap
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onIncidentSelect={handleIncidentSelect}
                filters={filters}
              />

              {/* List Panel */}
              <IncidentList
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onIncidentSelect={handleIncidentSelect}
                onStatusUpdate={handleStatusUpdate}
                onAssignIncident={handleAssignIncident}
                onAddComment={handleAddComment}
              />
            </div>
          </div>
        )}

        {/* Map View */}
        {activeView === 'map' && (
          <div className="space-y-6">
            <IncidentFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
            
            <div className="h-[600px]">
              <IncidentMap
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onIncidentSelect={handleIncidentSelect}
                filters={filters}
              />
            </div>
          </div>
        )}

        {/* List View */}
        {activeView === 'list' && (
          <div className="space-y-6">
            <IncidentFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
            
            <div className="h-[600px]">
              <IncidentList
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onIncidentSelect={handleIncidentSelect}
                onStatusUpdate={handleStatusUpdate}
                onAssignIncident={handleAssignIncident}
                onAddComment={handleAddComment}
              />
            </div>
          </div>
        )}

        {/* Mobile Responsive Tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="flex justify-around">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('dashboard')}
              iconName="LayoutDashboard"
              className="flex-col h-auto py-2"
            >
              <span className="text-xs mt-1">Panel</span>
            </Button>
            <Button
              variant={activeView === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('map')}
              iconName="Map"
              className="flex-col h-auto py-2"
            >
              <span className="text-xs mt-1">Mapa</span>
            </Button>
            <Button
              variant={activeView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('list')}
              iconName="List"
              className="flex-col h-auto py-2"
            >
              <span className="text-xs mt-1">Lista</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground">
                  AsisPoch
                </p>
                <p className="text-sm text-muted-foreground">
                  Sistema de Monitoreo de Incidentes
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Escuela Superior Politécnica de Chimborazo
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Oficina de Inclusión y Bienestar Estudiantil
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CampusIncidentMonitor;