import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ContactPreferences = ({ contactInfo, onContactChange, error }) => {
  const notificationMethods = [
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'sms', label: 'Mensaje de Texto (SMS)' },
    { value: 'push', label: 'Notificaciones Push' },
    { value: 'phone', label: 'Llamada Telefónica' }
  ];

  const updateFrequencies = [
    { value: 'immediate', label: 'Inmediato - Cada actualización' },
    { value: 'daily', label: 'Diario - Resumen del día' },
    { value: 'milestone', label: 'Solo Hitos Importantes' },
    { value: 'completion', label: 'Solo al Completarse' }
  ];

  const handleInputChange = (field, value) => {
    onContactChange({
      ...contactInfo,
      [field]: value
    });
  };

  const handleNotificationToggle = (method) => {
    const updatedMethods = contactInfo?.notificationMethods?.includes(method)
      ? contactInfo?.notificationMethods?.filter(m => m !== method)
      : [...(contactInfo?.notificationMethods || []), method];
    
    handleInputChange('notificationMethods', updatedMethods);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Información de Contacto y Preferencias
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Proporciona tu información de contacto para recibir actualizaciones sobre el incidente
        </p>
      </div>
      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Información de Contacto</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre Completo"
            type="text"
            placeholder="Tu nombre completo"
            value={contactInfo?.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            required
          />

          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu.email@espoch.edu.ec"
            value={contactInfo?.email || ''}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            description="Usaremos este correo para enviarte actualizaciones"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Número de Teléfono"
            type="tel"
            placeholder="+593 99 123 4567"
            value={contactInfo?.phone || ''}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            description="Para contacto directo si es necesario"
          />

          <Input
            label="Cédula de Identidad (Opcional)"
            type="text"
            placeholder="1234567890"
            value={contactInfo?.idNumber || ''}
            onChange={(e) => handleInputChange('idNumber', e?.target?.value)}
            description="Para verificación institucional"
          />
        </div>

        <Input
          label="Relación con ESPOCH"
          type="text"
          placeholder="Ej: Estudiante de Ingeniería Mecánica, Personal Administrativo"
          value={contactInfo?.affiliation || ''}
          onChange={(e) => handleInputChange('affiliation', e?.target?.value)}
          description="Tu rol o relación con la institución"
        />
      </div>
      {/* Notification Preferences */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Preferencias de Notificación</h4>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Selecciona cómo te gustaría recibir actualizaciones sobre tu reporte:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {notificationMethods?.map((method) => (
              <div
                key={method?.value}
                className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  contactInfo?.notificationMethods?.includes(method?.value)
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => handleNotificationToggle(method?.value)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={contactInfo?.notificationMethods?.includes(method?.value) || false}
                    onChange={() => handleNotificationToggle(method?.value)}
                    className="pointer-events-none"
                  />
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={
                        method?.value === 'email' ? 'Mail' :
                        method?.value === 'sms' ? 'MessageSquare' :
                        method?.value === 'push' ? 'Bell' : 'Phone'
                      } 
                      size={16} 
                      className="text-muted-foreground"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {method?.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Select
          label="Frecuencia de Actualizaciones"
          placeholder="Selecciona la frecuencia"
          options={updateFrequencies}
          value={contactInfo?.updateFrequency}
          onChange={(value) => handleInputChange('updateFrequency', value)}
          description="Con qué frecuencia quieres recibir actualizaciones"
        />
      </div>
      {/* Additional Preferences */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Preferencias Adicionales</h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 border border-border rounded-lg">
            <Checkbox
              checked={contactInfo?.allowDirectContact || false}
              onChange={(e) => handleInputChange('allowDirectContact', e?.target?.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Permitir contacto directo del personal de mantenimiento
              </p>
              <p className="text-xs text-muted-foreground">
                El equipo técnico podrá contactarte directamente para aclaraciones o coordinación
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 border border-border rounded-lg">
            <Checkbox
              checked={contactInfo?.shareWithSecurity || false}
              onChange={(e) => handleInputChange('shareWithSecurity', e?.target?.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Compartir información con seguridad del campus
              </p>
              <p className="text-xs text-muted-foreground">
                Para incidentes de seguridad, permitir que el equipo de seguridad acceda a tu reporte
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 border border-border rounded-lg">
            <Checkbox
              checked={contactInfo?.anonymousReport || false}
              onChange={(e) => handleInputChange('anonymousReport', e?.target?.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Mantener reporte anónimo
              </p>
              <p className="text-xs text-muted-foreground">
                Tu identidad no será compartida en reportes públicos o estadísticas
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Hours */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Horarios de Contacto Preferidos</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Hora de Inicio"
            type="time"
            value={contactInfo?.contactStartTime || '08:00'}
            onChange={(e) => handleInputChange('contactStartTime', e?.target?.value)}
            description="Hora más temprana para contactarte"
          />

          <Input
            label="Hora de Fin"
            type="time"
            value={contactInfo?.contactEndTime || '18:00'}
            onChange={(e) => handleInputChange('contactEndTime', e?.target?.value)}
            description="Hora más tardía para contactarte"
          />
        </div>

        <Input
          label="Comentarios Adicionales sobre Contacto"
          type="text"
          placeholder="Ej: Disponible solo por las mañanas, preferir WhatsApp"
          value={contactInfo?.contactComments || ''}
          onChange={(e) => handleInputChange('contactComments', e?.target?.value)}
          description="Cualquier información adicional sobre tus preferencias de contacto"
        />
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </div>
      )}
      {/* Privacy Notice */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Privacidad y Protección de Datos
            </p>
            <p className="text-xs text-muted-foreground">
              Tu información personal será utilizada únicamente para el seguimiento de este incidente 
              y se mantendrá confidencial según las políticas de privacidad de ESPOCH. 
              Puedes solicitar la eliminación de tus datos una vez resuelto el incidente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPreferences;