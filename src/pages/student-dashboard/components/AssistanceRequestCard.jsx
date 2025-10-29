import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

const AssistanceRequestCard = ({ request, onViewDetails, onCancelRequest }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'text-success bg-success/10 border-success/20';
      case 'in-progress':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'pending':
        return 'text-muted-foreground bg-muted border-border';
      case 'completed':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'assigned':
        return 'UserCheck';
      case 'in-progress':
        return 'Clock';
      case 'pending':
        return 'Hourglass';
      case 'completed':
        return 'CheckCircle';
      default:
        return 'HelpCircle';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return date.toLocaleDateString('es-ES');
  };

  const formatETA = (etaMs) => {
    if (!etaMs) return 'Por determinar';
    const minutes = Math.floor(etaMs / 60000);
    return `~${minutes} min`;
  };

 const handleViewDetails = (e) => {
    e.stopPropagation(); // Previene la propagación del evento
    setShowDetailsModal(true);
    // NO llamar onViewDetails aquí si quieres que se abra el modal
  };

  const handleCardClick = () => {
    // Si quieres que el clic en toda la tarjeta abra el modal
    setShowDetailsModal(true);
  };

  // Si quieres que el modal se abra pero también notifiques al padre:
  const handleModalOpen = () => {
    setShowDetailsModal(true);
    if (onViewDetails) {
      onViewDetails(request.id); // Solo si necesitas notificar al padre
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta solicitud?')) {
      onCancelRequest(request.id);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={request.typeIcon} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{request.type}</h3>
              <p className="text-sm text-muted-foreground">
                {formatTimeAgo(request.requestedAt)}
              </p>
            </div>
          </div>
          
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
            <Icon name={getStatusIcon(request.status)} size={12} />
            <span>{request.statusText}</span>
          </div>
        </div>

        <p className="text-sm text-foreground mb-3 line-clamp-2">
          {request.description}
        </p>

        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={14} />
            <span>{request.location}</span>
          </div>
          
          {request.assignedStaff && (
            <div className="flex items-center space-x-2">
              <Icon name="User" size={14} />
              <span>Asignado a: {request.assignedStaff.name}</span>
            </div>
          )}
          
          {request.eta && (
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} />
              <span>ETA: {formatETA(request.eta)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            iconName="Eye"
            iconPosition="left"
            className="flex-1"
          >
            Ver Detalles
          </Button>
          
          {request.status !== 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              iconName="X"
              className="w-9 h-9"
              aria-label="Cancelar solicitud"
            />
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Detalles de Solicitud - ${request.type}`}
        size="lg"
      >
        <div className="p-6 space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Descripción</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {request.description}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Ubicación</h4>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="MapPin" size={16} />
                  <span>{request.location}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Fecha y Hora</h4>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={16} />
                  <span>
                    {request.requestedAt.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <Icon name="Clock" size={16} />
                  <span>
                    {request.requestedAt.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Estado */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">Estado de la Solicitud</h4>
                <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor(request.status)}`}>
                  <Icon name={getStatusIcon(request.status)} size={16} />
                  <span className="font-medium">{request.statusText}</span>
                </div>
                
                {request.eta && (
                  <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-warning">
                      <Icon name="Clock" size={16} />
                      <span className="font-medium">Tiempo estimado de llegada: {formatETA(request.eta)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Asignado */}
              {request.assignedStaff && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Personal Asignado</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{request.assignedStaff.name}</p>
                      <p className="text-sm text-muted-foreground">{request.assignedStaff.role}</p>
                      {request.staffContact?.phone && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Icon name="Phone" size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{request.staffContact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              ID de solicitud: #{request.id}
            </div>
            
            <div className="flex items-center space-x-2">
              {request.staffContact?.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${request.staffContact.phone}`)}
                  iconName="Phone"
                  iconPosition="left"
                >
                  Llamar
                </Button>
              )}
              
              {request.status !== 'completed' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancel}
                  iconName="X"
                  iconPosition="left"
                >
                  Cancelar Solicitud
                </Button>
              )}
              
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowDetailsModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AssistanceRequestCard;