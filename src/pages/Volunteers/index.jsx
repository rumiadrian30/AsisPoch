import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import IncidentMap from './components/IncidentMap';
import IncidentList from './components/IncidentList';
import IncidentFilters from './components/IncidentFilters';
import IncidentStats from './components/IncidentStats';
import Button from '../../components/ui/Button';
import { ApiService } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext'; // Importar el contexto
import Icon from '../../components/AppIcon';

// Función auxiliar que RECIBE 'user' como parámetro
const getFixedVolunteerProfile = (user) => ({
  id: user?.userId || 1,
  name: user?.fullName || 'Voluntario ESPOCH',
  email: user?.email || 'voluntario@espoch.edu.ec',
  phone: '+593 98 765 4321',
  skills: ['first_aid', 'communication', 'mobility_assistance'],
  availability: 'part_time',
  experience_level: 'intermediate',
  status: 'active',
  total_assignments: 5,
  completed_assignments: 3,
  created_at: new Date().toISOString()
});

const Volunteers = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Obtener usuario del contexto
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filters, setFilters] = useState({
    status: 'active',
    severity: 'all',
    type: 'all',
    location: '',
    department: 'all',
    assignable: true
  });
  
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para voluntarios
  const [incidents, setIncidents] = useState([]);
  const [volunteerProfile, setVolunteerProfile] = useState({
    id: 1,
    name: 'Voluntario ESPOCH',
    email: 'voluntario@espoch.edu.ec',
    phone: '+593 98 765 4321',
    skills: ['first_aid', 'communication', 'mobility_assistance'],
    availability: 'part_time',
    experience_level: 'intermediate',
    status: 'active',
    total_assignments: 5,
    completed_assignments: 3,
    created_at: new Date().toISOString()
  });
  
  const [myAssignments, setMyAssignments] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;
    
    setLoading(true);
    await Promise.all([
      loadIncidentsFromDatabase(),
      loadMyAssignments()
    ]);
    setVolunteerProfile(getFixedVolunteerProfile(user));
    setLoading(false);
  };

  // Cargar asignaciones del voluntario
  const loadMyAssignments = async () => {
    if (!user?.email) return;
    
    try {
      const result = await ApiService.getMyAssignments(user.email);
      if (result.success) {
        setMyAssignments(result.data);
      }
    } catch (error) {
      console.error('Error cargando asignaciones:', error);
      // Asignaciones de ejemplo basadas en el usuario
      setMyAssignments([
        {
          id: 1,
          incident_id: 3,
          volunteer_email: user.email,
          status: 'assigned',
          assigned_at: new Date().toISOString(),
          title: 'Ascensor fuera de servicio en Biblioteca',
          description: 'El ascensor principal de la biblioteca no funciona',
          severity: 'high',
          incident_status: 'in-progress',
          location_building: 'Biblioteca Central',
          reported_at: new Date().toISOString()
        }
      ]);
    }
  };

  // Función para cargar incidentes desde la base de datos
  const loadIncidentsFromDatabase = async () => {
    if (!user?.email) return;
    
    setError(null);
    try {
      console.log('📥 Cargando incidentes para voluntarios...');
      const result = await ApiService.getIncidentsForVolunteers();
      
      if (result.success) {
        console.log(`✅ Se cargaron ${result.data.length} incidentes`);
        setIncidents(result.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(result.error || 'Error al cargar incidentes');
      }
    } catch (error) {
      console.error('❌ Error cargando incidentes:', error);
      setError('No se pudieron cargar los incidentes. ' + error.message);
      setIncidents(getBackupIncidents());
    }
  };

  // Datos de respaldo
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
        estimated_resolution: '4-6 horas',
        assignable: true,
        volunteers_needed: 2,
        current_volunteers: 0,
        assigned_to_me: false
      },
      {
        id: 2,
        title: 'Ayuda para movilización entre edificios',
        description: 'Estudiante requiere asistencia para moverse del Edificio B al Edificio F',
        severity: 'medium',
        status: 'active',
        location_building: 'Edificio B',
        reporter_full_name: 'Carlos Pérez',
        reported_at: new Date().toISOString(),
        affected_users: 1,
        route_impact: 'minor',
        estimated_resolution: '30 minutos',
        assignable: true,
        volunteers_needed: 1,
        current_volunteers: 0,
        assigned_to_me: false
      },
      {
        id: 3,
        title: 'Ascensor fuera de servicio en Biblioteca',
        description: 'El ascensor principal de la biblioteca no funciona, afectando a usuarios con movilidad reducida',
        severity: 'high',
        status: 'in-progress',
        location_building: 'Biblioteca Central',
        reporter_full_name: 'Ana López',
        reported_at: new Date().toISOString(),
        affected_users: 8,
        route_impact: 'major',
        estimated_resolution: '2-3 horas',
        assignable: true,
        volunteers_needed: 1,
        current_volunteers: 1,
        assigned_to_me: user?.email ? true : false // Basado en el usuario actual
      }
    ];
  };

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'disconnected');
      if (connectionStatus === 'connected') {
        loadIncidentsFromDatabase();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  // Asignarse a un incidente
  const handleSelfAssign = async (incidentId) => {
    if (!user?.email) {
      setError('No se pudo identificar al usuario');
      return;
    }

    try {
      console.log('🔄 Intentando asignarse al incidente:', incidentId);
      
      const result = await ApiService.assignVolunteerToIncident(
        incidentId, 
        user.email,
        user.fullName
      );
      
      if (result.success) {
        console.log('✅ Asignación exitosa, recargando datos...');
        await Promise.all([loadIncidentsFromDatabase(), loadMyAssignments()]);
        setError(null);
      } else {
        setError('Error del servidor: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleSelfAssign:', error);
      setError('Error de conexión: ' + error.message);
    }
  };


  // Liberarse de un incidente
  const handleSelfUnassign = async (incidentId) => {
    if (!user?.email) {
      setError('No se pudo identificar al usuario');
      return;
    }

    try {
      console.log('🔄 Intentando liberarse del incidente:', incidentId);
      
      const result = await ApiService.unassignVolunteerFromIncident(
        incidentId, 
        user.email,
        user.fullName
      );
      
      if (result.success) {
        console.log('✅ Liberación exitosa, recargando datos...');
        await Promise.all([loadIncidentsFromDatabase(), loadMyAssignments()]);
        setError(null);
      } else {
        setError('Error del servidor: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleSelfUnassign:', error);
      setError('Error de conexión: ' + error.message);
    }
  };

  // Actualizar estado del incidente
  const handleStatusUpdate = async (incidentId, newStatus) => {
    try {
      const result = await ApiService.updateIncidentStatus(incidentId, newStatus);
      if (result.success) {
        setIncidents(prev => prev.map(incident =>
          incident.id === incidentId
            ? { ...incident, status: newStatus }
            : incident
        ));
        console.log(`✅ Estado actualizado: ${incidentId} -> ${newStatus}`);
        setError(null);
      }
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      setError('Error actualizando estado: ' + error.message);
    }
  };

  // Agregar comentario como voluntario
  const handleAddComment = async (incidentId, commentText) => {
    try {
      const result = await ApiService.addVolunteerComment(
        incidentId, 
        commentText, 
        volunteerProfile.name
      );
      if (result.success) {
        console.log(`✅ Comentario agregado: ${incidentId}`);
        setError(null);
      }
    } catch (error) {
      console.error('❌ Error agregando comentario:', error);
      setError('Error agregando comentario: ' + error.message);
    }
  };

  // Manejar cambios de filtros
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      status: 'active',
      severity: 'all',
      type: 'all',
      location: '',
      department: 'all',
      assignable: true
    });
  };

  // Filtrar incidentes para voluntarios
  const filteredIncidents = incidents.filter((incident) => {
    if (!incident) return false;
    
    if (filters.status !== 'all' && incident.status !== filters.status) return false;
    if (filters.severity !== 'all' && incident.severity !== filters.severity) return false;
    if (filters.type !== 'all' && incident.type !== filters.type) return false;
    if (filters.location && !incident.location_building?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.assignable && !incident.assignable) return false;
    
    return true;
  });

  // Incidentes asignados a mí
  const myActiveAssignments = myAssignments.filter(assignment => 
    assignment.status === 'assigned' || assignment.status === 'in_progress'
  );

  const handleRefresh = () => {
    loadInitialData();
  };

  const handleEmergencyRequest = () => {
    navigate('/request-assistance', { state: { emergency: true } });
  };

  const handleRoleSwitch = (newRole) => {
    console.log('Switching to role:', newRole);
  };

  // Componente simple de perfil de voluntario
  const VolunteerProfileCard = () => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <Icon name="User" size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-foreground">{user?.fullName || 'Voluntario'}</h3>
          <p className="text-sm text-muted-foreground">Voluntario ESPOCH</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Nivel:</span>
          <span className="font-medium capitalize">{volunteerProfile?.experience_level}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Asignaciones totales:</span>
          <span className="font-medium text-primary">{volunteerProfile?.total_assignments}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Completadas:</span>
          <span className="font-medium text-success">{volunteerProfile?.completed_assignments}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Activas:</span>
          <span className="font-medium text-warning">{myActiveAssignments.length}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-1">
          {volunteerProfile?.skills?.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {skill === 'first_aid' && 'Primeros Auxilios'}
              {skill === 'communication' && 'Comunicación'}
              {skill === 'mobility_assistance' && 'Asistencia Movilidad'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="volunteers"
        userEmail={user?.email}
        userName={user?.fullName}
        onEmergencyRequest={handleEmergencyRequest}
        onRoleSwitch={handleRoleSwitch}
        onLogout={logout}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Portal de Voluntarios
            </h1>
            <p className="text-muted-foreground">
              Ayuda a mejorar la accesibilidad en el campus - Asiste en incidentes reportados
            </p>
            
            {/* Estados de carga y error */}
            {loading && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-primary">
                <Icon name="Refresh" size={16} className="animate-spin" />
                <span>Cargando incidentes...</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-destructive">
                <Icon name="AlertTriangle" size={16} />
                <span>{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setError(null)}
                  iconName="X"
                >
                  Cerrar
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Estadísticas rápidas para voluntarios registrados */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg">
              <Icon name="Award" size={16} className="text-primary" />
              <span className="text-sm font-caption text-muted-foreground">
                {myActiveAssignments.length} asignación{myActiveAssignments.length !== 1 ? 'es' : ''} activa{myActiveAssignments.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Estado de conexión */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-success' : 'bg-error'
              }`} />
              <span className="text-sm font-caption text-muted-foreground">
                {connectionStatus === 'connected' ? 'En línea' : 'Desconectado'}
              </span>
              <span className="text-xs text-muted-foreground">
                {lastUpdate.toLocaleTimeString('es-ES')}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              loading={loading}
              iconName="Refresh"
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
                className="px-3"
              >
                Panel
              </Button>
              <Button
                variant={activeView === 'tasks' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('tasks')}
                iconName="ClipboardList"
                className="px-3"
              >
                Mis Tareas
              </Button>
              <Button
                variant={activeView === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('map')}
                iconName="Map"
                className="px-3"
              >
                Mapa
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
                {incidents.length} incidente{incidents.length !== 1 ? 's' : ''} cargado{incidents.length !== 1 ? 's' : ''}
              </div>
              <div className="text-muted-foreground">
                Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
              </div>
              <div className="text-muted-foreground">
                {myActiveAssignments.length} tarea{myActiveAssignments.length !== 1 ? 's' : ''} activa{myActiveAssignments.length !== 1 ? 's' : ''}
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
            {/* Estadísticas y perfil */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <IncidentStats incidents={filteredIncidents} volunteerView={true} />
              </div>
              <div className="lg:col-span-1">
                <VolunteerProfileCard />
              </div>
            </div>

            {/* Filtros */}
            <IncidentFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              volunteerView={true}
            />

            {/* Panel dual */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[500px]">
              <IncidentMap
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onIncidentSelect={setSelectedIncident}
                volunteerView={true}
              />

              <IncidentList
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onIncidentSelect={setSelectedIncident}
                onStatusUpdate={handleStatusUpdate}
                onSelfAssign={handleSelfAssign}
                onSelfUnassign={handleSelfUnassign}
                onAddComment={handleAddComment}
                volunteerView={true}
                myAssignments={myAssignments}
              />
            </div>
          </div>
        )}

        {/* Mis Tareas View - Solo para voluntarios registrados */}
        {activeView === 'tasks' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-foreground">Mis Tareas Activas</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={loadMyAssignments}
                iconName="Refresh"
              >
                Actualizar
              </Button>
            </div>
            
            {myActiveAssignments.length > 0 ? (
              <div className="space-y-4">
                {myActiveAssignments.map(assignment => (
                  <div key={assignment.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.severity === 'critical' ? 'text-error bg-error/10' :
                        assignment.severity === 'high' ? 'text-warning bg-warning/10' :
                        'text-primary bg-primary/10'
                      }`}>
                        {assignment.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={14} />
                          <span>{assignment.location_building}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} />
                          <span>Asignado: {new Date(assignment.assigned_at).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelfUnassign(assignment.incident_id)}
                        iconName="UserMinus"
                      >
                        Liberarme
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="ClipboardList" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">No tienes tareas activas</h3>
                <p className="text-sm text-muted-foreground">
                  Asigna a incidentes disponibles desde el panel principal para comenzar a ayudar.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Map View */}
        {activeView === 'map' && (
          <div className="space-y-6">
            <IncidentFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              volunteerView={true}
            />
            
            <div className="h-[600px]">
              <IncidentMap
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onIncidentSelect={setSelectedIncident}
                volunteerView={true}
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
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
              variant={activeView === 'tasks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('tasks')}
              iconName="ClipboardList"
              className="flex-col h-auto py-2"
            >
              <span className="text-xs mt-1">Tareas</span>
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground">
                  Voluntarios ESPOCH
                </p>
                <p className="text-sm text-muted-foreground">
                  Programa de Accesibilidad
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

export default Volunteers;