import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RequestForm = ({ 
  description, 
  onDescriptionChange, 
  onSubmit, 
  isSubmitting,
  formErrors,
  className = "" 
}) => {
  const [characterCount, setCharacterCount] = useState(description?.length || 0);
  const maxCharacters = 500;
  const minCharacters = 20;

  const handleDescriptionChange = (e) => {
    const value = e?.target?.value;
    setCharacterCount(value?.length);
    onDescriptionChange(value);
  };

  const getCharacterCountColor = () => {
    if (characterCount < minCharacters) return 'text-muted-foreground';
    if (characterCount > maxCharacters * 0.9) return 'text-warning';
    if (characterCount > maxCharacters) return 'text-error';
    return 'text-success';
  };

  const isDescriptionValid = characterCount >= minCharacters && characterCount <= maxCharacters;

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Descripción de la Solicitud
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Describe detalladamente qué tipo de asistencia necesitas
        </p>
      </div>
      {/* Description Input */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe tu solicitud de asistencia de manera detallada. Incluye información sobre tu ubicación específica, el tipo de ayuda que necesitas, y cualquier detalle relevante que pueda ayudar al personal a prepararse adecuadamente..."
            className={`
              w-full min-h-32 p-4 border rounded-lg resize-none
              ${formErrors?.description 
                ? 'border-error focus:ring-error' :'border-border focus:ring-ring'
              }
              bg-input text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-offset-2
              transition-colors duration-200
            `}
            maxLength={maxCharacters}
            aria-describedby="description-help description-count"
            aria-invalid={!!formErrors?.description}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-3 right-3">
            <span 
              id="description-count"
              className={`text-xs font-mono ${getCharacterCountColor()}`}
            >
              {characterCount}/{maxCharacters}
            </span>
          </div>
        </div>

        {/* Help Text */}
        <div id="description-help" className="space-y-2">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">
                <strong>Incluye información sobre:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Tu ubicación exacta o punto de referencia</li>
                <li>Tipo específico de asistencia requerida</li>
                <li>Cualquier equipo o material necesario</li>
                <li>Horario preferido si no es urgente</li>
                <li>Personas adicionales que te acompañan</li>
              </ul>
            </div>
          </div>

          {/* Validation Messages */}
          {characterCount < minCharacters && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="AlertCircle" size={16} />
              <span>
                Necesitas al menos {minCharacters - characterCount} caracteres más para una descripción completa
              </span>
            </div>
          )}

          {characterCount > maxCharacters && (
            <div className="flex items-center space-x-2 text-sm text-error">
              <Icon name="AlertTriangle" size={16} />
              <span>
                Has excedido el límite por {characterCount - maxCharacters} caracteres
              </span>
            </div>
          )}

          {formErrors?.description && (
            <div className="flex items-center space-x-2 text-sm text-error">
              <Icon name="XCircle" size={16} />
              <span>{formErrors?.description}</span>
            </div>
          )}
        </div>
      </div>
      {/* Quick Templates */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground text-sm">Plantillas Rápidas:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            {
              title: 'Asistencia de Movilidad',
              template: 'Necesito asistencia para desplazarme desde [ubicación actual] hasta [destino]. Uso silla de ruedas y requiero acceso por rampa. El motivo del desplazamiento es [razón].'
            },
            {
              title: 'Apoyo Académico',
              template: 'Solicito apoyo académico para [actividad específica]. Necesito [tipo de asistencia] debido a [necesidad específica]. La actividad está programada para [fecha/hora].'
            },
            {
              title: 'Emergencia Médica',
              template: 'EMERGENCIA: Necesito asistencia médica inmediata. Me encuentro en [ubicación exacta]. Síntomas: [descripción]. Tengo [condiciones médicas relevantes].'
            },
            {
              title: 'Acceso a Instalaciones',
              template: 'Necesito ayuda para acceder a [edificio/aula específica]. Requiero [tipo de asistencia] debido a [barreras de accesibilidad]. Mi clase/cita es a las [hora].'
            }
          ]?.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                onDescriptionChange(template?.template);
                setCharacterCount(template?.template?.length);
              }}
              className="p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <div className="font-medium text-sm text-foreground mb-1">
                {template?.title}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {template?.template?.substring(0, 80)}...
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Submit Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="default"
          size="lg"
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={!isDescriptionValid || isSubmitting}
          iconName="Send"
          iconPosition="right"
          fullWidth
          className="h-12"
        >
          {isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud de Asistencia'}
        </Button>

        {!isDescriptionValid && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Completa la descripción para enviar tu solicitud
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestForm;