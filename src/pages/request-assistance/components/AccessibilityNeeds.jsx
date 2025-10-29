import React from 'react';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AccessibilityNeeds = ({ 
  accessibilityNeeds, 
  onAccessibilityChange, 
  communicationMethod, 
  onCommunicationChange,
  specialRequirements,
  onSpecialRequirementsChange,
  className = "" 
}) => {
  const accessibilityOptions = [
    {
      id: 'wheelchair',
      label: 'Usuario de silla de ruedas',
      description: 'Necesito acceso para silla de ruedas y espacios amplios'
    },
    {
      id: 'visual_impairment',
      label: 'Discapacidad visual',
      description: 'Requiero asistencia para navegación y lectura'
    },
    {
      id: 'hearing_impairment',
      label: 'Discapacidad auditiva',
      description: 'Prefiero comunicación visual o por texto'
    },
    {
      id: 'cognitive_support',
      label: 'Apoyo cognitivo',
      description: 'Necesito instrucciones claras y tiempo adicional'
    },
    {
      id: 'mobility_assistance',
      label: 'Asistencia de movilidad',
      description: 'Requiero ayuda para caminar o desplazarme'
    },
    {
      id: 'sign_language',
      label: 'Lenguaje de señas',
      description: 'Necesito intérprete de lenguaje de señas'
    }
  ];

  const communicationOptions = [
    { value: 'phone', label: 'Llamada telefónica' },
    { value: 'sms', label: 'Mensaje de texto (SMS)' },
    { value: 'email', label: 'Correo electrónico' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'in_person', label: 'Comunicación en persona' },
    { value: 'sign_language', label: 'Lenguaje de señas' }
  ];

  const handleAccessibilityToggle = (needId, checked) => {
    const updatedNeeds = checked 
      ? [...accessibilityNeeds, needId]
      : accessibilityNeeds?.filter(id => id !== needId);
    onAccessibilityChange(updatedNeeds);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Necesidades de Accesibilidad
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Especifica tus necesidades para que podamos brindarte la mejor asistencia
        </p>
      </div>
      {/* Accessibility Needs Checkboxes */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Selecciona tus necesidades:</h4>
        
        <CheckboxGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessibilityOptions?.map((option) => (
              <div key={option?.id} className="bg-card border border-border rounded-lg p-4">
                <Checkbox
                  id={option?.id}
                  checked={accessibilityNeeds?.includes(option?.id)}
                  onChange={(e) => handleAccessibilityToggle(option?.id, e?.target?.checked)}
                  label={option?.label}
                  description={option?.description}
                />
              </div>
            ))}
          </div>
        </CheckboxGroup>
      </div>
      {/* Communication Method */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Método de Comunicación Preferido</h4>
        
        <Select
          label="¿Cómo prefieres que nos comuniquemos contigo?"
          description="Selecciona el método más cómodo para ti"
          options={communicationOptions}
          value={communicationMethod}
          onChange={onCommunicationChange}
          placeholder="Selecciona un método de comunicación"
          required
        />
      </div>
      {/* Special Requirements */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Requisitos Especiales</h4>
        
        <Input
          label="Información adicional"
          type="text"
          placeholder="Describe cualquier necesidad específica o información importante..."
          description="Incluye detalles sobre equipos especiales, medicamentos, alergias, o cualquier otra información relevante"
          value={specialRequirements}
          onChange={(e) => onSpecialRequirementsChange(e?.target?.value)}
          className="min-h-20"
        />
      </div>
      {/* Accessibility Summary */}
      {accessibilityNeeds?.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">
                Resumen de Necesidades Seleccionadas
              </h4>
              <div className="space-y-1">
                {accessibilityNeeds?.map(needId => {
                  const option = accessibilityOptions?.find(opt => opt?.id === needId);
                  return (
                    <div key={needId} className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-primary" />
                      <span className="text-sm text-foreground">{option?.label}</span>
                    </div>
                  );
                })}
              </div>
              
              {communicationMethod && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <div className="flex items-center space-x-2">
                    <Icon name="MessageCircle" size={14} className="text-primary" />
                    <span className="text-sm text-foreground">
                      Comunicación: {communicationOptions?.find(opt => opt?.value === communicationMethod)?.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Important Notice */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-sm text-foreground mb-1">
              Información Importante
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Toda la información proporcionada será tratada de manera confidencial y 
              utilizada únicamente para brindarte la mejor asistencia posible. 
              Nuestro personal está capacitado para atender diversas necesidades de accesibilidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityNeeds;