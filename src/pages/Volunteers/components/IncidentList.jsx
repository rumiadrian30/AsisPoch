import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { ApiService } from '../../../services/apiService';

const IncidentList = ({ 
  incidents, 
  selectedIncident, 
  onIncidentSelect, 
  onStatusUpdate, 
  onSelfAssign, 
  onSelfUnassign, 
  onAddComment,
  volunteerView = false,
  myAssignments = []
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState('reported_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [commentingIncident, setCommentingIncident] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Obtener IDs de incidentes asignados a mí
  const myAssignmentIds = myAssignments
    .filter(assignment => assignment.status === 'assigned' || assignment.status === 'in_progress')
    .map(assignment => assignment.incident_id);

  // Sort incidents
  const sortedIncidents = [...incidents]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];

    if (sortBy === 'reported_at' || sortBy === 'reportedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSelectAll = () => {
    if (selectedItems?.length === incidents?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(incidents?.map(i => i?.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev?.includes(id) 
        ? prev?.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Funcionalidad de Auto-Asignación para voluntarios
  const handleSelfAssignClick = async (incidentId) => {
    if (!onSelfAssign) return;
    
    setLoading(true);
    try {
      await onSelfAssign(incidentId);
    } catch (error) {
      console.error('Error auto-asignándose:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funcionalidad de Auto-Liberación para voluntarios
  const handleSelfUnassignClick = async (incidentId) => {
    if (!onSelfUnassign) return;
    
    setLoading(true);
    try {
      await onSelfUnassign(incidentId);
    } catch (error) {
      console.error('Error auto-liberándose:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funcionalidad de Comentar
  const handleCommentClick = (incidentId) => {
    setCommentingIncident(incidentId);
    setCommentText('');
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() && commentingIncident && onAddComment) {
      setLoading(true);
      try {
        await onAddComment(commentingIncident, commentText);
        setCommentingIncident(null);
        setCommentText('');
      } catch (error) {
        console.error('Error agregando comentario:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCommentCancel = () => {
    setCommentingIncident(null);
    setCommentText('');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error bg-error/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-primary bg-primary/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-warning bg-warning/10';
      case 'in-progress': return 'text-primary bg-primary/10';
      case 'resolved': return 'text-success bg-success/10';
      case 'closed': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'in-progress': return 'En Progreso';
      case 'resolved': return 'Resuelto';
      case 'closed': return 'Cerrado';
      default: return status;
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'critical': return 'Crítico';
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      case 'low': return 'Bajo';
      default: return severity;
    }
  };

  // Función para obtener imágenes placeholder
  const getPlaceholderImage = (severity) => {
    const placeholderImages = {
      critical: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=150&h=150&fit=crop',
      high: 'https://images.unsplash.com/photo-1616007736933-4e8aed0de147?w=150&h=150&fit=crop',
      medium: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=150&h=150&fit=crop',
      low: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=150&h=150&fit=crop'
    };
    return placeholderImages[severity] || placeholderImages.medium;
  };

  // Verificar si un incidente está asignado al voluntario actual
  const isAssignedToMe = (incidentId) => {
    return myAssignmentIds.includes(incidentId) || incidents.find(i => i.id === incidentId)?.assigned_to_me;
  };

  // Verificar si un incidente tiene cupos disponibles
  const hasAvailableSlots = (incident) => {
    const currentVolunteers = incident.current_volunteers || 0;
    const volunteersNeeded = incident.volunteers_needed || 0;
    return volunteersNeeded === 0 || currentVolunteers < volunteersNeeded;
  };

  // Obtener información de disponibilidad de voluntarios
  const getVolunteerAvailabilityInfo = (incident) => {
    const current = incident.current_volunteers || 0;
    const needed = incident.volunteers_needed || 0;
    
    if (needed === 0) {
      return `${current} voluntario(s) asignado(s)`;
    }
    
    return `${current}/${needed} voluntario(s)`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* List Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            {volunteerView ? 'Incidentes Disponibles' : 'Lista de Incidentes'}
          </h3>
          <div className="flex items-center space-x-2">
            {!volunteerView && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  iconName="Download"
                  iconPosition="left"
                  className="px-3"
                  disabled={incidents.length === 0}
                >
                  Exportar
                </Button>

                {showExportMenu && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-10">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          // Implementar exportación básica
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center space-x-2"
                      >
                        <Icon name="FileText" size={16} />
                        <span>CSV (.csv)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              iconName="Filter"
              iconPosition="left"
              className="px-3"
            >
              Filtros
            </Button>
          </div>
        </div>

        {/* Información específica para voluntarios */}
        {volunteerView && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Sistema de Auto-Asignación
                </p>
                <p className="text-xs text-blue-700">
                  Puedes asignarte a incidentes disponibles y gestionar tus tareas activas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm border border-border rounded px-2 py-1 bg-background"
              disabled={loading}
            >
              <option value="reported_at">Fecha</option>
              <option value="severity">Severidad</option>
              <option value="status">Estado</option>
              <option value="location_building">Ubicación</option>
              {volunteerView && <option value="volunteers_needed">Voluntarios Necesarios</option>}
            </select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
              className="w-8 h-8"
              disabled={loading}
            />
          </div>
        </div>

        {/* Cierra el menú de exportación cuando se hace clic fuera */}
        {showExportMenu && (
          <div 
            className="fixed inset-0 z-5" 
            onClick={() => setShowExportMenu(false)}
          />
        )}
      </div>

      {/* Modal de Comentarios */}
      {commentingIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-96">
            <h3 className="font-semibold text-lg mb-4">Agregar Comentario</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Comentario:</label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escribe tu comentario aquí..."
                  rows="4"
                  className="w-full border border-border rounded px-3 py-2 bg-background resize-none"
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCommentCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || loading}
                  loading={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Comentario'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Select All Header (solo para admin) */}
        {!volunteerView && (
          <div className="sticky top-0 bg-muted/80 backdrop-blur-sm border-b border-border p-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems?.length === incidents?.length && incidents?.length > 0}
                onChange={handleSelectAll}
                className="rounded border-border"
                disabled={loading}
              />
              <span className="text-sm font-medium text-foreground">
                Seleccionar todos ({incidents?.length})
              </span>
            </label>
          </div>
        )}

        {/* Incident Items */}
        <div className="divide-y divide-border">
          {sortedIncidents?.map((incident) => {
            const isAssigned = isAssignedToMe(incident.id);
            const hasSlots = hasAvailableSlots(incident);
            
            return (
              <div
                key={incident?.id}
                className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedIncident?.id === incident?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                } ${loading ? 'opacity-50 pointer-events-none' : ''} ${
                  isAssigned ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                }`}
                onClick={() => !loading && onIncidentSelect(incident)}
              >
                <div className="flex items-start space-x-3">
                  {/* Selection Checkbox (solo para admin) */}
                  {!volunteerView && (
                    <input
                      type="checkbox"
                      checked={selectedItems?.includes(incident?.id)}
                      onChange={(e) => {
                        e?.stopPropagation();
                        handleSelectItem(incident?.id);
                      }}
                      className="mt-1 rounded border-border"
                      disabled={loading}
                    />
                  )}

                  {/* Incident Photo */}
                  {incident?.photos && incident?.photos?.length > 0 ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      <Image
                        src={incident.photos[0]?.url || getPlaceholderImage(incident.severity)}
                        alt={incident.photos[0]?.alt || `Imagen del incidente ${incident.title}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = getPlaceholderImage(incident.severity);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border bg-muted flex items-center justify-center">
                      <Icon name="Image" size={24} className="text-muted-foreground" />
                    </div>
                  )}

                  {/* Incident Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground truncate">
                          {incident?.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {incident?.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident?.severity)}`}>
                          {getSeverityLabel(incident?.severity)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident?.status)}`}>
                          {getStatusLabel(incident?.status)}
                        </span>
                      </div>
                    </div>

                    {/* Incident Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={14} />
                        <span className="truncate">
                          {incident?.location_building || 'Ubicación no especificada'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>
                          {incident?.reported_at ? new Date(incident.reported_at).toLocaleDateString('es-ES') : 'Fecha no disponible'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="User" size={14} />
                        <span className="truncate">
                          {incident?.reporter_full_name || 'Reportante no especificado'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={14} />
                        <span>{incident?.affected_users || 0} usuarios afectados</span>
                      </div>
                    </div>

                    {/* Información de Voluntarios */}
                    {volunteerView && incident.assignable && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon name="Users" size={16} className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                              {getVolunteerAvailabilityInfo(incident)}
                            </span>
                          </div>
                          {isAssigned && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Asignado a ti
                            </span>
                          )}
                        </div>
                        {incident.volunteer_instructions && (
                          <p className="text-xs text-blue-700 mt-2">
                            {incident.volunteer_instructions}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Asignado a (solo para admin) */}
                    {!volunteerView && incident?.assigned_to && (
                      <div className="bg-primary/10 rounded-lg p-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="UserCheck" size={14} className="text-primary" />
                          <span className="text-primary font-medium">
                            Asignado a: {incident.assigned_to}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Impact Assessment */}
                    <div className="bg-muted/50 rounded-lg p-3 mb-3">
                      <h5 className="font-medium text-sm text-foreground mb-2">
                        Evaluación de Impacto
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Impacto en rutas:</span>
                          <span className={`ml-2 font-medium ${
                            incident?.route_impact === 'major' ? 'text-error' :
                            incident?.route_impact === 'moderate'? 'text-warning' : 'text-success'
                          }`}>
                            {incident?.route_impact === 'major' ? 'Mayor' :
                             incident?.route_impact === 'moderate' ? 'Moderado' : 'Menor'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tiempo estimado:</span>
                          <span className="ml-2 font-medium text-foreground">
                            {incident?.estimated_resolution || 'Por determinar'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {/* Botones para Voluntarios */}
                      {volunteerView && incident.assignable && (
                        <>
                          {!isAssigned && hasSlots && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation();
                                handleSelfAssignClick(incident?.id);
                              }}
                              iconName="UserPlus"
                              iconPosition="left"
                              className="px-3"
                              disabled={loading}
                              loading={loading}
                            >
                              Asignarme
                            </Button>
                          )}
                          
                          {isAssigned && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation();
                                handleSelfUnassignClick(incident?.id);
                              }}
                              iconName="UserMinus"
                              iconPosition="left"
                              className="px-3"
                              disabled={loading}
                              loading={loading}
                            >
                              Liberarme
                            </Button>
                          )}
                          
                          {!hasSlots && !isAssigned && (
                            <span className="text-xs text-muted-foreground italic">
                              No hay cupos disponibles
                            </span>
                          )}
                        </>
                      )}

                      {/* Botones para Admin */}
                      {!volunteerView && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e?.stopPropagation();
                              // Aquí iría la lógica de asignación para admin
                            }}
                            iconName="UserPlus"
                            iconPosition="left"
                            className="px-3"
                            disabled={loading}
                          >
                            {incident?.assigned_to ? 'Reasignar' : 'Asignar'}
                          </Button>
                          
                          {incident?.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation();
                                onStatusUpdate(incident?.id, 'in-progress');
                              }}
                              iconName="Play"
                              iconPosition="left"
                              className="px-3"
                              disabled={loading}
                            >
                              Iniciar
                            </Button>
                          )}
                          
                          {incident?.status === 'in-progress' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation();
                                onStatusUpdate(incident?.id, 'resolved');
                              }}
                              iconName="Check"
                              iconPosition="left"
                              className="px-3"
                              disabled={loading}
                            >
                              Resolver
                            </Button>
                          )}
                        </>
                      )}

                      {/* Botón de comentarios (compartido) */}
                      {onAddComment && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleCommentClick(incident?.id);
                          }}
                          iconName="MessageSquare"
                          iconPosition="left"
                          className="px-3"
                          disabled={loading}
                        >
                          Comentar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {incidents?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon 
              name={volunteerView ? "Users" : "AlertTriangle"} 
              size={48} 
              className="text-muted-foreground mb-4" 
            />
            <h3 className="font-medium text-foreground mb-2">
              {volunteerView ? 'No hay incidentes disponibles' : 'No hay incidentes'}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {volunteerView 
                ? 'No se encontraron incidentes que requieran asistencia de voluntarios en este momento.'
                : 'No se encontraron incidentes que coincidan con los filtros actuales.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;