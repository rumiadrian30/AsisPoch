import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const AccessibilityPreferences = ({ preferences, onUpdatePreferences, onSavePreferences }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localPreferences, setLocalPreferences] = useState({
    mobilityAids: ['wheelchair'],
    visualSupport: ['high_contrast'],
    auditorySupport: [],
    cognitiveSupport: ['simple_navigation'],
    routePreferences: {
      avoidStairs: true,
      preferRamps: true,
      avoidCrowdedAreas: false,
      requireElevators: true,
      maxWalkingDistance: 500
    },
    notificationPreferences: {
      pushNotifications: true,
      smsAlerts: true,
      emailUpdates: false,
      voiceAlerts: false
    },
    emergencyContacts: [
      {
        id: 1,
        name: "Angel Guaño",
        relationship: "Compañero de clase",
        phone: "+593-99-123-4567",
        isPrimary: true
      }
    ]
  });

  const mobilityOptions = [
    { value: 'wheelchair', label: 'Silla de ruedas', description: 'Requiere acceso sin escalones' },
    { value: 'walker', label: 'Andador', description: 'Necesita superficies estables' },
    { value: 'crutches', label: 'Muletas', description: 'Evitar superficies resbaladizas' },
    { value: 'cane', label: 'Bastón', description: 'Apoyo para caminar' },
    { value: 'prosthetic', label: 'Prótesis', description: 'Consideraciones especiales de movilidad' }
  ];

  const visualSupportOptions = [
    { value: 'high_contrast', label: 'Alto contraste', description: 'Mejora la visibilidad del texto' },
    { value: 'large_text', label: 'Texto grande', description: 'Aumenta el tamaño de fuente' },
    { value: 'screen_reader', label: 'Lector de pantalla', description: 'Compatible con tecnologías asistivas' },
    { value: 'voice_guidance', label: 'Guía por voz', description: 'Instrucciones de navegación habladas' },
    { value: 'tactile_feedback', label: 'Retroalimentación táctil', description: 'Vibración para confirmaciones' }
  ];

  const auditorySupportOptions = [
    { value: 'visual_alerts', label: 'Alertas visuales', description: 'Notificaciones con indicadores visuales' },
    { value: 'sign_language', label: 'Lenguaje de señas', description: 'Interpretación disponible' },
    { value: 'text_captions', label: 'Subtítulos', description: 'Texto para contenido de audio' },
    { value: 'vibration_alerts', label: 'Alertas por vibración', description: 'Notificaciones táctiles' }
  ];

  const cognitiveSupportOptions = [
    { value: 'simple_navigation', label: 'Navegación simplificada', description: 'Interfaz con menos elementos' },
    { value: 'step_by_step', label: 'Instrucciones paso a paso', description: 'Guía detallada para cada acción' },
    { value: 'memory_aids', label: 'Ayudas de memoria', description: 'Recordatorios y confirmaciones' },
    { value: 'extended_time', label: 'Tiempo extendido', description: 'Más tiempo para completar acciones' }
  ];

  const distanceOptions = [
    { value: 100, label: '100 metros' },
    { value: 200, label: '200 metros' },
    { value: 300, label: '300 metros' },
    { value: 500, label: '500 metros' },
    { value: 1000, label: '1 kilómetro' },
    { value: -1, label: 'Sin límite' }
  ];

  const handleCheckboxChange = (category, value, checked) => {
    setLocalPreferences(prev => ({
      ...prev,
      [category]: checked
        ? [...prev?.[category], value]
        : prev?.[category]?.filter(item => item !== value)
    }));
  };

  const handleRoutePreferenceChange = (key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      routePreferences: {
        ...prev?.routePreferences,
        [key]: value
      }
    }));
  };

  const handleNotificationPreferenceChange = (key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev?.notificationPreferences,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    onSavePreferences && onSavePreferences(localPreferences);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalPreferences(preferences || localPreferences);
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={20} className="text-primary" />
            <h3 className="font-semibold text-lg text-foreground">
              Preferencias de Accesibilidad
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Check"
                  onClick={handleSave}
                >
                  Guardar
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
        {/* Mobility Aids */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Ayudas de Movilidad</h4>
          <div className="space-y-2">
            {mobilityOptions?.map((option) => (
              <div key={option?.value} className="flex items-start space-x-3">
                <Checkbox
                  checked={localPreferences?.mobilityAids?.includes(option?.value)}
                  onChange={(e) => handleCheckboxChange('mobilityAids', option?.value, e?.target?.checked)}
                  disabled={!isEditing}
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground">
                    {option?.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {option?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Support */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Apoyo Visual</h4>
          <div className="space-y-2">
            {visualSupportOptions?.map((option) => (
              <div key={option?.value} className="flex items-start space-x-3">
                <Checkbox
                  checked={localPreferences?.visualSupport?.includes(option?.value)}
                  onChange={(e) => handleCheckboxChange('visualSupport', option?.value, e?.target?.checked)}
                  disabled={!isEditing}
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground">
                    {option?.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {option?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auditory Support */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Apoyo Auditivo</h4>
          <div className="space-y-2">
            {auditorySupportOptions?.map((option) => (
              <div key={option?.value} className="flex items-start space-x-3">
                <Checkbox
                  checked={localPreferences?.auditorySupport?.includes(option?.value)}
                  onChange={(e) => handleCheckboxChange('auditorySupport', option?.value, e?.target?.checked)}
                  disabled={!isEditing}
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground">
                    {option?.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {option?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cognitive Support */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Apoyo Cognitivo</h4>
          <div className="space-y-2">
            {cognitiveSupportOptions?.map((option) => (
              <div key={option?.value} className="flex items-start space-x-3">
                <Checkbox
                  checked={localPreferences?.cognitiveSupport?.includes(option?.value)}
                  onChange={(e) => handleCheckboxChange('cognitiveSupport', option?.value, e?.target?.checked)}
                  disabled={!isEditing}
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground">
                    {option?.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {option?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Preferences */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Preferencias de Ruta</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Evitar escaleras</label>
              <Checkbox
                checked={localPreferences?.routePreferences?.avoidStairs}
                onChange={(e) => handleRoutePreferenceChange('avoidStairs', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Preferir rampas</label>
              <Checkbox
                checked={localPreferences?.routePreferences?.preferRamps}
                onChange={(e) => handleRoutePreferenceChange('preferRamps', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Evitar áreas concurridas</label>
              <Checkbox
                checked={localPreferences?.routePreferences?.avoidCrowdedAreas}
                onChange={(e) => handleRoutePreferenceChange('avoidCrowdedAreas', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Requerir ascensores</label>
              <Checkbox
                checked={localPreferences?.routePreferences?.requireElevators}
                onChange={(e) => handleRoutePreferenceChange('requireElevators', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Distancia máxima de caminata
              </label>
              <Select
                options={distanceOptions}
                value={localPreferences?.routePreferences?.maxWalkingDistance}
                onChange={(value) => handleRoutePreferenceChange('maxWalkingDistance', value)}
                disabled={!isEditing}
                placeholder="Seleccionar distancia"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Preferencias de Notificación</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Notificaciones push</label>
              <Checkbox
                checked={localPreferences?.notificationPreferences?.pushNotifications}
                onChange={(e) => handleNotificationPreferenceChange('pushNotifications', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Alertas SMS</label>
              <Checkbox
                checked={localPreferences?.notificationPreferences?.smsAlerts}
                onChange={(e) => handleNotificationPreferenceChange('smsAlerts', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Actualizaciones por email</label>
              <Checkbox
                checked={localPreferences?.notificationPreferences?.emailUpdates}
                onChange={(e) => handleNotificationPreferenceChange('emailUpdates', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Alertas de voz</label>
              <Checkbox
                checked={localPreferences?.notificationPreferences?.voiceAlerts}
                onChange={(e) => handleNotificationPreferenceChange('voiceAlerts', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Contactos de Emergencia</h4>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
              >
                Agregar
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {localPreferences?.emergencyContacts?.map((contact) => (
              <div key={contact?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{contact?.name}</p>
                    <p className="text-xs text-muted-foreground">{contact?.relationship} • {contact?.phone}</p>
                  </div>
                </div>
                
                {contact?.isPrimary && (
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPreferences;