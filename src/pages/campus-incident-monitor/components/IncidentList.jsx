import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { ApiService } from '../../../services/apiService';

const IncidentList = ({ incidents, selectedIncident, onIncidentSelect, onStatusUpdate, onAssignIncident, onAddComment, volunteerView = false  }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState('reported_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [assigningIncident, setAssigningIncident] = useState(null);
  const [commentingIncident, setCommentingIncident] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Estado para voluntarios (solo admin)
  const [selectedVolunteerIncident, setSelectedVolunteerIncident] = useState(null);
  const [volunteerAssignments, setVolunteerAssignments] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

   // NUEVO: Estado para lista de voluntarios disponibles
  const [volunteersList, setVolunteersList] = useState([]);
  const [loadingVolunteersList, setLoadingVolunteersList] = useState(false);

  // Cargar lista de voluntarios cuando se abre el modal de asignación
  useEffect(() => {
    if (assigningIncident) {
      loadVolunteersList();
    }
  }, [assigningIncident]);

   // Función para cargar la lista de voluntarios desde la base de datos
  const loadVolunteersList = async () => {
    setLoadingVolunteersList(true);
    try {
      // Necesitarás crear esta función en tu ApiService
      const result = await ApiService.getAllVolunteers();
      if (result.success) {
        setVolunteersList(result.data);
        console.log(`✅ ${result.data.length} voluntarios cargados`);
      } else {
        console.error('Error cargando voluntarios:', result.error);
        setVolunteersList([]);
      }
    } catch (error) {
      console.error('Error cargando lista de voluntarios:', error);
      setVolunteersList([]);
    } finally {
      setLoadingVolunteersList(false);
    }
  };

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

  // Cargar asignaciones de voluntarios cuando se selecciona un incidente
  useEffect(() => {
    if (selectedVolunteerIncident && !volunteerView) {
      loadVolunteerAssignments(selectedVolunteerIncident);
    }
  }, [selectedVolunteerIncident]);

  const loadVolunteerAssignments = async (incidentId) => {
    setLoadingVolunteers(true);
    try {
      const result = await ApiService.getIncidentVolunteerAssignments(incidentId);
      if (result.success) {
        setVolunteerAssignments(result.data);
      }
    } catch (error) {
      console.error('Error cargando asignaciones de voluntarios:', error);
      setVolunteerAssignments([]);
    } finally {
      setLoadingVolunteers(false);
    }
  };

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

  const handleBulkStatusUpdate = async (status) => {
    setLoading(true);
    try {
      for (const id of selectedItems) {
        if (import.meta.env.VITE_API_URL) {
          await ApiService.updateIncidentStatus(id, status);
        }
        onStatusUpdate(id, status);
      }
      setSelectedItems([]);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funcionalidad de Asignar
  const handleAssignClick = (incidentId) => {
    setAssigningIncident(incidentId);
    setAssignedUser('');
  };

  const handleAssignSubmit = async () => {
    if (assignedUser.trim() && assigningIncident) {
      setLoading(true);
      try {
        // Encontrar el nombre del voluntario seleccionado
        const selectedVolunteer = volunteersList.find(v => v.email === assignedUser);
        const volunteerName = selectedVolunteer ? selectedVolunteer.name : 'Voluntario';
        
        if (import.meta.env.VITE_API_URL) {
          const result = await ApiService.assignIncident(assigningIncident, assignedUser);
          if (result.success) {
            onAssignIncident(assigningIncident, assignedUser, volunteerName);
          }
        } else {
          // Simulación si no hay backend configurado
          onAssignIncident(assigningIncident, assignedUser, volunteerName);
        }
        setAssigningIncident(null);
        setAssignedUser('');
      } catch (error) {
        console.error('Error assigning incident:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAssignCancel = () => {
    setAssigningIncident(null);
    setAssignedUser('');
  };

  // Funcionalidad de Comentar
  const handleCommentClick = (incidentId) => {
    setCommentingIncident(incidentId);
    setCommentText('');
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() && commentingIncident) {
      setLoading(true);
      try {
        if (import.meta.env.VITE_API_URL) {
          const result = await ApiService.addComment(commentingIncident, commentText, 'Usuario Actual');
          if (result.success) {
            onAddComment(commentingIncident, commentText);
          }
        } else {
          // Simulación si no hay backend configurado
          onAddComment(commentingIncident, commentText);
        }
        setCommentingIncident(null);
        setCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
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

  // Funcionalidad de Exportar
  const handleExport = async (format = 'csv') => {
    setExporting(true);
    try {
      const dataToExport = selectedItems.length > 0 
        ? incidents.filter(incident => selectedItems.includes(incident.id))
        : incidents;

      if (format === 'csv') {
        await exportToCSV(dataToExport);
      } else if (format === 'excel') {
        await exportToExcel(dataToExport);
      } else if (format === 'pdf') {
        await exportToPDF(dataToExport);
      }
      
      console.log(`✅ Exportación ${format} completada`);
    } catch (error) {
      console.error('❌ Error en exportación:', error);
      alert('Error al exportar los datos: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  // Exportar a CSV
  const exportToCSV = (data) => {
    const headers = [
      'ID', 'Número de Seguimiento', 'Título', 'Descripción', 'Severidad', 
      'Estado', 'Ubicación', 'Reportado por', 'Email', 'Teléfono',
      'Asignado a', 'Fecha Reporte', 'Usuarios Afectados', 'Impacto Ruta',
      'Resolución Estimada', 'Características Afectadas'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(incident => [
        incident.id,
        `"${incident.tracking_number || 'N/A'}"`,
        `"${incident.title || 'N/A'}"`,
        `"${(incident.description || 'N/A').replace(/"/g, '""')}"`,
        incident.severity || 'N/A',
        incident.status || 'N/A',
        `"${incident.location_building || 'N/A'}"`,
        `"${incident.reporter_full_name || 'N/A'}"`,
        `"${incident.reporter_email || 'N/A'}"`,
        `"${incident.reporter_phone || 'N/A'}"`,
        `"${incident.assigned_to || 'No asignado'}"`,
        `"${incident.reported_at ? new Date(incident.reported_at).toLocaleDateString('es-ES') : 'N/A'}"`,
        incident.affected_users || 0,
        incident.route_impact || 'N/A',
        `"${incident.estimated_resolution || 'N/A'}"`,
        `"${(incident.accessibility_features || []).join('; ') || 'Ninguna'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `incidentes_espoch_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar a Excel (usando CSV como alternativa simple)
  const exportToExcel = (data) => {
    // Para una implementación real necesitarías una librería como xlsx
    // Por ahora usamos CSV como alternativa
    exportToCSV(data);
  };

  // Exportar a PDF (versión simple)
  const exportToPDF = (data) => {
    // Crear un PDF simple usando window.print()
    const printWindow = window.open('', '_blank');
    const title = `Reporte de Incidentes ESPOCH - ${new Date().toLocaleDateString('es-ES')}`;
    
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .summary { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="summary">
          <strong>Resumen:</strong> ${data.length} incidentes exportados<br>
          <strong>Fecha de exportación:</strong> ${new Date().toLocaleString('es-ES')}<br>
          <strong>Filtro aplicado:</strong> ${selectedItems.length > 0 ? `${selectedItems.length} incidentes seleccionados` : 'Todos los incidentes'}
        </div>
        <table>
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Título</th>
              <th>Severidad</th>
              <th>Estado</th>
              <th>Ubicación</th>
              <th>Reportado por</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(incident => `
              <tr>
                <td>${incident.tracking_number || 'N/A'}</td>
                <td>${incident.title || 'N/A'}</td>
                <td>${getSeverityLabel(incident.severity)}</td>
                <td>${getStatusLabel(incident.status)}</td>
                <td>${incident.location_building || 'N/A'}</td>
                <td>${incident.reporter_full_name || 'N/A'}</td>
                <td>${incident.reported_at ? new Date(incident.reported_at).toLocaleDateString('es-ES') : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  // Menú desplegable para exportar
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* List Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Lista de Incidentes
          </h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
                iconName="Download"
                iconPosition="left"
                className="px-3"
                disabled={exporting || incidents.length === 0}
                loading={exporting}
              >
              Exportar
            </Button>

              {showExportMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-10">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        handleExport('csv');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center space-x-2"
                      disabled={exporting}
                    >
                      <Icon name="FileText" size={16} />
                      <span>CSV (.csv)</span>
                    </button>
                    <button
                      onClick={() => {
                        handleExport('excel');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center space-x-2"
                      disabled={exporting}
                    >
                      <Icon name="Table" size={16} />
                      <span>Excel (.xlsx)</span>
                    </button>
                    <button
                      onClick={() => {
                        handleExport('pdf');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center space-x-2"
                      disabled={exporting}
                    >
                      <Icon name="File" size={16} />
                      <span>PDF (.pdf)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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

        {/* Información de exportación */}
        {selectedItems.length > 0 && (
          <div className="p-3 bg-primary/10 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedItems.length} incidente(s) seleccionado(s) para exportar
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItems([])}
                className="text-xs"
              >
                Limpiar selección
              </Button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedItems?.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg mb-4">
            <span className="text-sm font-medium text-primary">
              {selectedItems?.length} incidente(s) seleccionado(s)
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusUpdate('in-progress')}
                className="px-3"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Marcar en Progreso'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusUpdate('resolved')}
                className="px-3"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Marcar Resuelto'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedItems([])}
                className="w-8 h-8"
                disabled={loading}
              />
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
              <option value="reportedAt">Fecha</option>
              <option value="severity">Severidad</option>
              <option value="status">Estado</option>
              <option value="location">Ubicación</option>
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

      {/* Modales */}
      {/* Modal de Asignación */}
      {assigningIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-96">
            <h3 className="font-semibold text-lg mb-4">Asignar Incidente</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Asignar a:</label>
                
                {loadingVolunteersList ? (
                  <div className="flex items-center justify-center py-4">
                    <Icon name="Refresh" size={20} className="animate-spin text-primary mr-2" />
                    <span className="text-sm text-muted-foreground">Cargando voluntarios...</span>
                  </div>
                ) : (
                  <select
                    value={assignedUser}
                    onChange={(e) => setAssignedUser(e.target.value)}
                    className="w-full border border-border rounded px-3 py-2 bg-background"
                    disabled={loading || volunteersList.length === 0}
                  >
                    <option value="">Seleccionar voluntario...</option>
                    {volunteersList.map((volunteer) => (
                      <option 
                        key={volunteer.id} 
                        value={volunteer.email} // Guardar el email para la asignación
                      >
                        {volunteer.name} - {volunteer.email}
                      </option>
                    ))}
                  </select>
                )}
                
                {volunteersList.length === 0 && !loadingVolunteersList && (
                  <p className="text-xs text-muted-foreground mt-2">
                    No hay voluntarios disponibles en la base de datos
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  {volunteersList.length} voluntario(s) disponible(s)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadVolunteersList}
                  iconName="Refresh"
                  className="text-xs"
                  disabled={loadingVolunteersList}
                >
                  Actualizar
                </Button>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleAssignCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAssignSubmit}
                  disabled={!assignedUser || loading || volunteersList.length === 0}
                  loading={loading}
                >
                  {loading ? 'Asignando...' : 'Asignar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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

       {/* Modal de detalles de voluntarios - SOLO PARA ADMIN */}
      {!volunteerView && selectedVolunteerIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Voluntarios Asignados</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedVolunteerIncident(null);
                  setVolunteerAssignments([]);
                }}
                iconName="X"
              />
            </div>
            
            {loadingVolunteers ? (
              <div className="flex items-center justify-center py-8">
                <Icon name="Refresh" size={24} className="animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Cargando voluntarios...</span>
              </div>
            ) : volunteerAssignments.length > 0 ? (
              <div className="space-y-3">
                {volunteerAssignments.map(assignment => (
                  <div key={assignment.id} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{assignment.volunteer_name || assignment.volunteer_email}</p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.volunteer_phone || 'Sin teléfono'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        assignment.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        assignment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {assignment.status === 'assigned' ? 'Asignado' :
                         assignment.status === 'in_progress' ? 'En Progreso' : 'Completado'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Asignado: {new Date(assignment.assigned_at).toLocaleDateString('es-ES')}
                    </p>
                    {assignment.volunteer_skills && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {JSON.parse(assignment.volunteer_skills).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No hay voluntarios asignados a este incidente
              </p>
            )}
          </div>
        </div>
      )}

      {/* List Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Select All Header */}
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

        {/* Incident Items */}
        <div className="divide-y divide-border">
          {sortedIncidents?.map((incident) => (
            <div
              key={incident?.id}
              className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                selectedIncident?.id === incident?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
              } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => !loading && onIncidentSelect(incident)}
            >
              <div className="flex items-start space-x-3">
                {/* Selection Checkbox */}
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
                      <p className="text-sm text-muted-foreground mt-1">
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

                  {/* Asignado a (personal/admin) */}
                  {incident?.assigned_to && (
                    <div className="bg-primary/10 rounded-lg p-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Icon name="UserCheck" size={14} className="text-primary" />
                        <span className="text-primary font-medium">
                          Asignado a: {incident.assigned_volunteer_name || incident.assigned_to}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Información de Voluntarios - SOLO PARA ADMIN */}
                  {!volunteerView && (
                    <>
                      {incident.current_volunteers > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm">
                              <Icon name="Users" size={14} className="text-green-600" />
                              <span className="text-green-700 font-medium">
                                {incident.current_volunteers} 
                                {incident.volunteers_needed ? `/${incident.volunteers_needed}` : ''} 
                                voluntario(s) asignado(s)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation();
                                setSelectedVolunteerIncident(incident.id);
                              }}
                              iconName="Eye"
                              className="text-xs"
                            >
                              Ver
                            </Button>
                          </div>
                        </div>
                      )}

                      {incident.volunteers_needed > 0 && incident.current_volunteers === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <Icon name="UserPlus" size={14} className="text-yellow-600" />
                            <span className="text-yellow-700">
                              Se necesitan {incident.volunteers_needed} voluntario(s)
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Comentarios recientes */}
                  {incident?.comments && incident.comments.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-2 mb-3">
                      <div className="flex items-start space-x-2">
                        <Icon name="MessageSquare" size={14} className="text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Último comentario:
                          </span>
                          <p className="text-sm text-foreground">
                            {incident.comments[incident.comments.length - 1].text}
                          </p>
                        </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleAssignClick(incident?.id);
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {incidents?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="AlertTriangle" size={48} className="text-muted-foreground mb-4" />
            <h3 className="font-medium text-foreground mb-2">No hay incidentes</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              No se encontraron incidentes que coincidan con los filtros actuales.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;