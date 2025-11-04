import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ApiService } from '../../../services/apiService';

const AlertBanner = ({ alerts, onDismiss, onViewAlternatives, onViewDetails }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Cargar incidentes desde la base de datos
  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      console.log('📥 Cargando incidentes para AlertBanner...');
      
      const result = await ApiService.getAllIncidents();
      
      if (result.success) {
        console.log(`✅ ${result.data.length} incidentes cargados`);
        setIncidents(result.data);
      } else {
        throw new Error(result.error || 'Error al cargar incidentes');
      }
    } catch (error) {
      console.error('❌ Error cargando incidentes:', error);
      setError('No se pudieron cargar las alertas');
      setIncidents(getBackupIncidents());
    } finally {
      setLoading(false);
    }
  };

  // Datos de respaldo en caso de error
  const getBackupIncidents = () => {
    return [
      {
        id: 1,
        title: 'Ascensor Fuera de Servicio',
        description: 'El ascensor del Edificio B está temporalmente fuera de servicio debido a mantenimiento preventivo. El equipo técnico está trabajando en la reparación.',
        severity: 'high',
        status: 'active',
        location_building: 'Edificio B',
        location_area: 'Planta Baja',
        location_description: 'Cerca de la biblioteca',
        reporter_full_name: 'Departamento de Mantenimiento',
        reporter_email: 'mantenimiento@espoch.edu.ec',
        reported_at: new Date(Date.now() - 3600000).toISOString(),
        estimated_resolution: '2 horas',
        route_impact: 'major',
        affected_users: 15,
        accessibility_features: ['elevator'],
        incident_types: ['equipment_failure'],
        volunteers_needed: 1,
        current_volunteers: 0
      },
      {
        id: 2,
        title: 'Trabajos de Mantenimiento en Rampa',
        description: 'Mantenimiento programado en la rampa de acceso principal. Se ha habilitado acceso temporal por la entrada lateral del Edificio A.',
        severity: 'medium',
        status: 'active',
        location_building: 'Entrada Principal',
        location_area: 'Acceso Principal',
        location_description: 'Rampa de acceso para sillas de ruedas',
        reporter_full_name: 'Oficina de Infraestructura',
        reporter_email: 'infraestructura@espoch.edu.ec',
        reported_at: new Date(Date.now() - 1800000).toISOString(),
        estimated_resolution: '1 hora',
        route_impact: 'moderate',
        affected_users: 8,
        accessibility_features: ['ramp'],
        incident_types: ['maintenance'],
        volunteers_needed: 0,
        current_volunteers: 0
      }
    ];
  };

  // Convertir incidentes de la base de datos a formato de alertas
  const mapIncidentsToAlerts = (incidentsData) => {
    return incidentsData
      .filter(incident => 
        incident.status === 'active' && 
        ['high', 'medium'].includes(incident.severity)
      )
      .map(incident => {
        let alertType = 'hazard';
        if (incident.title?.toLowerCase().includes('mantenimiento') || 
            incident.title?.toLowerCase().includes('construcción')) {
          alertType = 'construction';
        }

        const affectedRoutes = getAffectedRoutes(incident.route_impact, incident.location_building);
        const estimatedResolution = calculateEstimatedResolution(incident.estimated_resolution);

        return {
          id: incident.id,
          type: alertType,
          severity: incident.severity,
          title: incident.title,
          message: incident.description,
          location: `${incident.location_building}${incident.location_area ? ` - ${incident.location_area}` : ''}`,
          location_details: incident.location_description,
          affectedRoutes: affectedRoutes,
          estimatedResolution: estimatedResolution,
          hasAlternatives: incident.route_impact === 'major' || incident.route_impact === 'moderate',
          actionRequired: incident.severity === 'high',
          incidentData: incident,
          reporter: incident.reporter_full_name,
          reportedAt: incident.reported_at,
          affectedUsers: incident.affected_users,
          accessibilityFeatures: incident.accessibility_features || [],
          incidentTypes: incident.incident_types || [],
          volunteersInfo: {
            needed: incident.volunteers_needed || 0,
            current: incident.current_volunteers || 0
          }
        };
      });
  };

  // Obtener rutas afectadas
  const getAffectedRoutes = (routeImpact, location) => {
    const routes = {
      'major': ['Todas las rutas principales', 'Rutas de acceso'],
      'moderate': ['Rutas cercanas al área'],
      'minor': ['Rutas específicas']
    };

    const baseRoutes = routes[routeImpact] || ['Rutas cercanas'];
    
    if (location?.includes('Edificio B')) {
      return [...baseRoutes, 'Biblioteca', 'Laboratorios de Informática'];
    } else if (location?.includes('Entrada Principal')) {
      return [...baseRoutes, 'Todas las rutas principales'];
    }

    return baseRoutes;
  };

  // Calcular timestamp de resolución estimada
  const calculateEstimatedResolution = (estimatedResolution) => {
    if (!estimatedResolution) return null;

    const now = new Date();
    let minutesToAdd = 60;

    if (estimatedResolution.includes('hora')) {
      const hours = parseInt(estimatedResolution) || 1;
      minutesToAdd = hours * 60;
    } else if (estimatedResolution.includes('min')) {
      minutesToAdd = parseInt(estimatedResolution) || 30;
    }

    return new Date(now.getTime() + minutesToAdd * 60000);
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'high':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error/30',
          textColor: 'text-error',
          iconColor: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'medium':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          textColor: 'text-warning',
          iconColor: 'text-warning',
          icon: 'AlertCircle'
        };
      default:
        return {
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          textColor: 'text-muted-foreground',
          iconColor: 'text-muted-foreground',
          icon: 'Bell'
        };
    }
  };

  const formatTimeRemaining = (timestamp) => {
    if (!timestamp) return 'Por determinar';
    
    const diff = timestamp - Date.now();
    if (diff <= 0) return 'Pronto resuelto';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    onDismiss && onDismiss(alertId);
  };

  const handleRefresh = () => {
    loadIncidents();
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowDetailsModal(true);
    onViewDetails && onViewDetails(alert);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedAlert(null);
  };

  const handleReportProblem = () => {
    if (selectedAlert) {
      console.log('Reportar problema con alerta:', selectedAlert.id);
      // Aquí puedes implementar la lógica para reportar un problema
      alert(`Problema reportado para: ${selectedAlert.title}`);
    }
  };

  const handleGetAssistance = () => {
    if (selectedAlert) {
      console.log('Solicitar asistencia para:', selectedAlert.id);
      window.open('tel:+593-3-2998-200', '_self');
    }
  };

  const handleShareAlert = () => {
    if (selectedAlert && navigator.share) {
      navigator.share({
        title: `Alerta: ${selectedAlert.title}`,
        text: selectedAlert.message,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(
        `Alerta ESPOCH: ${selectedAlert.title}\n${selectedAlert.message}\nUbicación: ${selectedAlert.location}`
      ).then(() => {
        alert('Alerta copiada al portapapeles');
      });
    }
  };

  // Usar incidentes reales o los proporcionados por props
  const activeAlerts = alerts && alerts.length > 0 ? alerts : mapIncidentsToAlerts(incidents);
  const visibleAlerts = activeAlerts?.filter(alert => !dismissedAlerts?.has(alert?.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
        <Icon name="Refresh" size={20} className="animate-spin text-primary mr-2" />
        <span className="text-sm text-muted-foreground">Cargando alertas...</span>
      </div>
    );
  }

  if (visibleAlerts?.length === 0) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-sm text-success font-medium">
            No hay alertas activas en este momento
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            iconName="Refresh"
            className="ml-auto"
          >
            Actualizar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Header con información de estado */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Alertas Activas</h3>
          <div className="flex items-center space-x-2">
            {error && (
              <span className="text-xs text-error">{error}</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              iconName="Refresh"
              disabled={loading}
            >
              Actualizar
            </Button>
          </div>
        </div>

        {/* Lista de Alertas */}
        {visibleAlerts?.map((alert) => {
          const config = getSeverityConfig(alert?.severity);
          
          return (
            <div
              key={alert?.id}
              className={`${config?.bgColor} ${config?.borderColor} border rounded-lg p-4 animate-slide-down`}
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start space-x-3">
                {/* Alert Icon */}
                <div className={`w-6 h-6 ${config?.iconColor} flex-shrink-0 mt-0.5`}>
                  <Icon name={config?.icon} size={24} />
                </div>

                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm ${config?.textColor} mb-1`}>
                        {alert?.title}
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        {alert?.message}
                      </p>
                    </div>

                    {/* Dismiss Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="X"
                      onClick={() => handleDismiss(alert?.id)}
                      className="ml-2 flex-shrink-0"
                      aria-label="Descartar alerta"
                    />
                  </div>

                  {/* Alert Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={14} />
                        <span>{alert?.location}</span>
                      </div>
                      
                      {alert?.estimatedResolution && (
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} />
                          <span>
                            Resolución estimada: {formatTimeRemaining(alert?.estimatedResolution)}
                          </span>
                        </div>
                      )}
                    </div>

                    {alert?.affectedRoutes?.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Rutas afectadas:</span> {alert?.affectedRoutes?.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {alert?.hasAlternatives && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Navigation"
                        iconPosition="left"
                        onClick={() => onViewAlternatives && onViewAlternatives(alert)}
                      >
                        Ver Alternativas
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconPosition="left"
                      onClick={() => handleViewDetails(alert)}
                    >
                      Más Detalles
                    </Button>

                    {alert?.actionRequired && (
                      <Button
                        variant="default"
                        size="sm"
                        iconName="Phone"
                        iconPosition="left"
                        onClick={() => {
                          window.open('tel:+593-3-2998-200', '_self');
                        }}
                      >
                        Solicitar Ayuda
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalles */}
      {showDetailsModal && selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedAlert.severity === 'high' ? 'bg-error/20 text-error' :
                  selectedAlert.severity === 'medium' ? 'bg-warning/20 text-warning' :
                  'bg-primary/20 text-primary'
                }`}>
                  <Icon 
                    name={selectedAlert.severity === 'high' ? 'AlertTriangle' : 'AlertCircle'} 
                    size={20} 
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedAlert.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedAlert.location}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                iconName="X"
              />
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Descripción */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                <p className="text-foreground leading-relaxed">
                  {selectedAlert.message}
                </p>
              </div>

              {/* Información Detallada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Información del Incidente</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Severidad:</span>
                      <span className={`text-sm font-medium ${
                        selectedAlert.severity === 'high' ? 'text-error' :
                        selectedAlert.severity === 'medium' ? 'text-warning' :
                        'text-primary'
                      }`}>
                        {selectedAlert.severity === 'high' ? 'Alta' : 'Media'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reportado por:</span>
                      <span className="text-sm font-medium">{selectedAlert.reporter || 'Sistema'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fecha de reporte:</span>
                      <span className="text-sm font-medium">
                        {formatDate(selectedAlert.reportedAt)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Usuarios afectados:</span>
                      <span className="text-sm font-medium">{selectedAlert.affectedUsers || 'No especificado'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Estado Actual</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tiempo estimado:</span>
                      <span className="text-sm font-medium">
                        {formatTimeRemaining(selectedAlert.estimatedResolution)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rutas afectadas:</span>
                      <span className="text-sm font-medium text-right">
                        {selectedAlert.affectedRoutes?.length || 0}
                      </span>
                    </div>
                    
                    {selectedAlert.volunteersInfo && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Voluntarios:</span>
                        <span className="text-sm font-medium">
                          {selectedAlert.volunteersInfo.current}/{selectedAlert.volunteersInfo.needed}
                        </span>
                      </div>
                    )}
                    
                    {selectedAlert.location_details && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Detalles ubicación:</span>
                        <span className="text-sm font-medium text-right">
                          {selectedAlert.location_details}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Características de Accesibilidad Afectadas */}
              {selectedAlert.accessibilityFeatures && selectedAlert.accessibilityFeatures.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Accesibilidad Afectada</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlert.accessibilityFeatures.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {feature === 'elevator' && 'Ascensor'}
                        {feature === 'ramp' && 'Rampa'}
                        {feature === 'wide_door' && 'Puerta Ancha'}
                        {feature === 'accessible_bathroom' && 'Baño Accesible'}
                        {feature || 'Característica'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rutas Afectadas */}
              {selectedAlert.affectedRoutes && selectedAlert.affectedRoutes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Rutas Afectadas</h3>
                  <ul className="space-y-1">
                    {selectedAlert.affectedRoutes.map((route, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <Icon name="MapPin" size={14} className="text-muted-foreground" />
                        <span>{route}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Acciones */}
              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-3">Acciones Disponibles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    iconName="Navigation"
                    iconPosition="left"
                    onClick={() => {
                      onViewAlternatives && onViewAlternatives(selectedAlert);
                      handleCloseModal();
                    }}
                  >
                    Ver Rutas Alternativas
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="Phone"
                    iconPosition="left"
                    onClick={handleGetAssistance}
                  >
                    Solicitar Asistencia
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="Flag"
                    iconPosition="left"
                    onClick={handleReportProblem}
                  >
                    Reportar Problema
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="Share"
                    iconPosition="left"
                    onClick={handleShareAlert}
                  >
                    Compartir Alerta
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="flex justify-end space-x-3 p-6 border-t border-border bg-muted/50">
              <Button
                variant="outline"
                onClick={handleCloseModal}
              >
                Cerrar
              </Button>
              {selectedAlert.actionRequired && (
                <Button
                  onClick={handleGetAssistance}
                  iconName="Phone"
                >
                  Ayuda Inmediata
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertBanner;