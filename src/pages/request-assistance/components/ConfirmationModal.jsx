import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  requestData, 
  correlationId,
  estimatedResponseTime,
  processingResult,
  chainProgress = []
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

  // Función para obtener icono según el handler
  const getHandlerIcon = (handlerName) => {
    const iconMap = {
      'EmergencyHandler': 'AlertTriangle',
      'MobilityHandler': 'Accessibility',
      'AcademicHandler': 'BookOpen',
      'WellbeingHandler': 'Heart',
      'NotificationHandler': 'Bell'
    };
    return iconMap[handlerName] || 'CheckCircle';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface rounded-lg shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-surface">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Solicitud Enviada Exitosamente
              </h2>
              <p className="text-sm text-muted-foreground">
                Tu solicitud ha sido procesada con Chain of Responsibility
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

          {/* Chain of Responsibility Section */}
          {processingResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon name="GitBranch" size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Procesado con Chain of Responsibility</h3>
                  <p className="text-xs text-blue-700">
                    Tu solicitud fue procesada por {processingResult.processedBy?.length || 0} handlers especializados
                  </p>
                </div>
              </div>
              
              {/* Handlers Timeline */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-blue-800">Flujo de Procesamiento</h4>
                  <span className="text-xs text-blue-600">
                    {processingResult.metadata?.duration 
                      ? `${processingResult.metadata.duration}ms` 
                      : 'Procesado'}
                  </span>
                </div>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                  
                  <div className="space-y-3">
                    {processingResult.processedBy?.map((handler, index) => {
                      const handlerName = handler.handler.replace('Handler', '');
                      const handlerIcon = getHandlerIcon(handler.handler);
                      const isLast = index === processingResult.processedBy.length - 1;
                      
                      return (
                        <div key={index} className="relative flex items-center space-x-3">
                          {/* Timeline dot */}
                          <div className={`
                            z-10 w-8 h-8 rounded-full flex items-center justify-center
                            ${isLast ? 'bg-green-100 border-2 border-green-300' : 'bg-blue-100 border-2 border-blue-300'}
                          `}>
                            <Icon 
                              name={handlerIcon} 
                              size={14} 
                              className={isLast ? 'text-green-600' : 'text-blue-600'} 
                            />
                          </div>
                          
                          {/* Handler info */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">
                                {handlerName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(handler.timestamp).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  second: '2-digit' 
                                })}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {index === 0 && 'Handler de emergencia - máxima prioridad'}
                              {index === 1 && 'Handler de movilidad - accesibilidad'}
                              {index === 2 && 'Handler académico - apoyo educativo'}
                              {index === 3 && 'Handler de bienestar - salud mental'}
                              {index === 4 && 'Handler de notificaciones - comunicación'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chain Statistics */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-blue-700">
                    {processingResult.processedBy?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Handlers</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-green-700">
                    {processingResult.status === 'completed' ? '✅' : '🔄'}
                  </div>
                  <div className="text-xs text-muted-foreground">Estado</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-purple-700">
                    {processingResult.errors?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Errores</div>
                </div>
              </div>

              {/* Errors if any */}
              {processingResult.errors?.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="AlertCircle" size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-800">Errores durante el procesamiento</span>
                  </div>
                  <div className="text-xs text-red-600 space-y-1">
                    {processingResult.errors.map((err, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="mt-0.5">•</span>
                        <span>{err.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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

          {/* Chain Progress Log (if available) */}
          {chainProgress.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="ListChecks" size={18} className="text-gray-600" />
                <h4 className="font-medium text-sm text-foreground">Registro de Procesamiento</h4>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {chainProgress.map((item, index) => (
                  <div 
                    key={index} 
                    className={`text-xs flex items-center space-x-2 ${
                      item.includes('✅') ? 'text-green-700' : 
                      item.includes('❌') ? 'text-red-700' : 
                      'text-gray-700'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-medium text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Features with Chain of Responsibility */}
          {processingResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Zap" size={18} className="text-green-600" />
                <h4 className="font-medium text-sm text-green-800">Ventajas del Chain of Responsibility</h4>
              </div>
              <ul className="text-xs text-green-700 space-y-1">
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={12} className="mt-0.5 text-green-500" />
                  <span>Procesamiento especializado por handlers dedicados</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={12} className="mt-0.5 text-green-500" />
                  <span>Trazabilidad completa del flujo de procesamiento</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={12} className="mt-0.5 text-green-500" />
                  <span>Manejo de errores granular y específico</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={12} className="mt-0.5 text-green-500" />
                  <span>Escalabilidad fácil para nuevos tipos de asistencia</span>
                </li>
              </ul>
            </div>
          )}

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
        <div className="sticky bottom-0 flex items-center justify-between p-6 border-t border-border bg-surface">
          <div className="text-sm text-muted-foreground">
            {processingResult ? (
              <span>
                Procesado con Chain of Responsibility • {new Date().toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            ) : (
              <span>
                Solicitud creada el {new Date().toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
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