import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  requestData, 
  correlationId,
  estimatedResponseTime 
}) => {
  if (!isOpen) return null;

  const getUrgencyInfo = (urgency) => {
    const urgencyMap = {
      low: { label: 'Baja Prioridad', color: 'text-green-600', bg: 'bg-green-50' },
      medium: { label: 'Prioridad Media', color: 'text-yellow-600', bg: 'bg-yellow-50' },
      high: { label: 'Alta Prioridad', color: 'text-orange-600', bg: 'bg-orange-50' },
      critical: { label: 'Crítico/Emergencia', color: 'text-red-600', bg: 'bg-red-50' }
    };
    return urgencyMap?.[urgency] || urgencyMap?.medium;
  };

  const getAssistanceTypeInfo = (type) => {
    const typeMap = {
      mobility: { label: 'Asistencia de Movilidad', icon: 'Accessibility' },
      academic: { label: 'Apoyo Académico', icon: 'BookOpen' },
      wellness: { label: 'Bienestar y Salud', icon: 'Heart' },
      emergency: { label: 'Emergencia', icon: 'AlertTriangle' }
    };
    return typeMap?.[type] || typeMap?.mobility;
  };

  const urgencyInfo = getUrgencyInfo(requestData?.urgency);
  const typeInfo = getAssistanceTypeInfo(requestData?.assistanceType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface rounded-lg shadow-xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Solicitud Enviada Exitosamente
              </h2>
              <p className="text-sm text-muted-foreground">
                Tu solicitud ha sido registrada y procesada
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Correlation ID */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Hash" size={20} className="text-primary" />
              <div>
                <h3 className="font-medium text-foreground">ID de Seguimiento</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Guarda este número para hacer seguimiento de tu solicitud
                </p>
                <div className="flex items-center space-x-2">
                  <code className="px-3 py-1 bg-muted rounded font-mono text-sm">
                    {correlationId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard?.writeText(correlationId)}
                    iconName="Copy"
                    iconSize={16}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Request Summary */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Resumen de la Solicitud</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assistance Type */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name={typeInfo?.icon} size={18} className="text-primary" />
                  <span className="font-medium text-sm text-foreground">Tipo de Asistencia</span>
                </div>
                <p className="text-sm text-muted-foreground">{typeInfo?.label}</p>
              </div>

              {/* Urgency Level */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Clock" size={18} className="text-primary" />
                  <span className="font-medium text-sm text-foreground">Nivel de Urgencia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${urgencyInfo?.bg} ${urgencyInfo?.color}`}>
                    {urgencyInfo?.label}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="MapPin" size={18} className="text-primary" />
                  <span className="font-medium text-sm text-foreground">Ubicación</span>
                </div>
                <p className="text-sm text-muted-foreground">{requestData?.location?.name}</p>
              </div>

              {/* Communication Method */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="MessageCircle" size={18} className="text-primary" />
                  <span className="font-medium text-sm text-foreground">Comunicación</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {requestData?.communicationMethod === 'phone' && 'Llamada telefónica'}
                  {requestData?.communicationMethod === 'sms' && 'Mensaje de texto (SMS)'}
                  {requestData?.communicationMethod === 'email' && 'Correo electrónico'}
                  {requestData?.communicationMethod === 'whatsapp' && 'WhatsApp'}
                  {requestData?.communicationMethod === 'in_person' && 'Comunicación en persona'}
                  {requestData?.communicationMethod === 'sign_language' && 'Lenguaje de señas'}
                </p>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Clock" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-foreground mb-1">
                  Tiempo de Respuesta Estimado
                </h4>
                <p className="text-sm text-muted-foreground">
                  Esperamos contactarte en aproximadamente{' '}
                  <span className="font-medium text-foreground">{estimatedResponseTime}</span>.
                  Recibirás notificaciones sobre el estado de tu solicitud.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Próximos Pasos</h4>
            <div className="space-y-2">
              {[
                'Un miembro del personal revisará tu solicitud inmediatamente',
                'Te contactaremos usando tu método de comunicación preferido',
                'Recibirás actualizaciones en tiempo real sobre el estado',
                'El personal llegará a tu ubicación según la prioridad establecida'
              ]?.map((step, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          {requestData?.urgency === 'critical' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Phone" size={20} className="text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-red-800 mb-1">
                    Contacto de Emergencia
                  </h4>
                  <p className="text-sm text-red-700">
                    Para emergencias médicas graves, también contacta al 911. 
                    Nuestro equipo de respuesta rápida ya ha sido notificado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Solicitud creada el {new Date()?.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          
          <Button
            variant="default"
            onClick={onClose}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;