import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import { ApiService } from '../../services/apiService';

// Import all components
import IncidentTypeSelector from './components/IncidentTypeSelector';
import LocationPicker from './components/LocationPicker';
import SeveritySelector from './components/SeveritySelector';
import PhotoUpload from './components/PhotoUpload';
import AccessibilityFeatures from './components/AccessibilityFeatures';
import ContactPreferences from './components/ContactPreferences';

const IncidentReporting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    incidentTypes: [],
    location: {
      building: '',
      area: '',
      coordinates: null,
      description: '',
      nearbyLandmark: '',
      method: 'manual'
    },
    severity: '',
    description: '',
    photos: [],
    accessibilityFeatures: [],
    contactInfo: {
      fullName: '',
      email: '',
      phone: '',
      idNumber: '',
      affiliation: '',
      notificationMethods: ['email'],
      updateFrequency: 'milestone',
      allowDirectContact: true,
      shareWithSecurity: false,
      anonymousReport: false,
      contactStartTime: '08:00',
      contactEndTime: '18:00',
      contactComments: ''
    },
    urgencyLevel: '',
    estimatedImpact: '',
    routeImpact: 'moderate',
    affectedUsers: 0
  });

  const totalSteps = 6;

  const steps = [
    { id: 1, title: 'Tipo de Incidente', icon: 'AlertTriangle' },
    { id: 2, title: 'Ubicación', icon: 'MapPin' },
    { id: 3, title: 'Severidad', icon: 'AlertCircle' },
    { id: 4, title: 'Descripción y Fotos', icon: 'FileText' },
    { id: 5, title: 'Características Afectadas', icon: 'Settings' },
    { id: 6, title: 'Información de Contacto', icon: 'User' }
  ];

  // Check for emergency mode from navigation state
  useEffect(() => {
    if (location?.state?.emergency) {
      setFormData(prev => ({
        ...prev,
        severity: 'critical',
        urgencyLevel: 'immediate',
        title: 'Incidente de Emergencia - ' + new Date().toLocaleString()
      }));
    }
  }, [location?.state]);

  // Voice recording simulation
  const handleVoiceRecording = () => {
    setIsVoiceRecording(true);
    
    setTimeout(() => {
      setIsVoiceRecording(false);
      const voiceText = "El ascensor del segundo piso de la Facultad de Mecánica no está funcionando desde esta mañana. Las puertas no abren y hay estudiantes con sillas de ruedas que no pueden acceder a sus clases.";
      setFormData(prev => ({
        ...prev,
        description: prev?.description + (prev?.description ? '\n\n' : '') + voiceText
      }));
    }, 3000);
  };

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (formData?.incidentTypes?.length === 0) {
          newErrors.incidentTypes = 'Selecciona al menos un tipo de incidente';
        }
        break;
      case 2:
        if (!formData?.location?.building && !formData?.location?.area && !formData?.location?.description) {
          newErrors.location = 'Proporciona información sobre la ubicación del incidente';
        }
        break;
      case 3:
        if (!formData?.severity) {
          newErrors.severity = 'Selecciona el nivel de severidad del incidente';
        }
        break;
      case 4:
        if (!formData?.description?.trim()) {
          newErrors.description = 'Proporciona una descripción del incidente';
        }
        if (formData?.description?.trim()?.length < 20) {
          newErrors.description = 'La descripción debe tener al menos 20 caracteres';
        }
        if (!formData?.title?.trim()) {
          newErrors.title = 'Proporciona un título para el incidente';
        }
        break;
      case 6:
        if (!formData?.contactInfo?.fullName?.trim()) {
          newErrors.contactFullName = 'El nombre completo es requerido';
        }
        if (!formData?.contactInfo?.email?.trim()) {
          newErrors.contactEmail = 'El correo electrónico es requerido';
        }
        if (formData?.contactInfo?.notificationMethods?.length === 0) {
          newErrors.contactNotifications = 'Selecciona al menos un método de notificación';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Navigation functions
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Preparar datos para el API
      const incidentData = {
        title: formData.title || `Incidente de ${formData.incidentTypes.join(', ')}`,
        description: formData.description,
        incidentTypes: formData.incidentTypes,
        severity: formData.severity,
        location: formData.location,
        accessibilityFeatures: formData.accessibilityFeatures,
        contactInfo: formData.contactInfo,
        urgencyLevel: formData.urgencyLevel,
        estimatedImpact: formData.estimatedImpact,
        routeImpact: formData.routeImpact,
        affectedUsers: formData.affectedUsers || 1,
        photos: formData.photos
      };

      // Enviar al backend
      const result = await ApiService.createIncident(incidentData);

      // Navegar a la página de éxito
      navigate('/student-dashboard', {
        state: {
          reportSubmitted: true,
          trackingNumber: result.trackingNumber,
          severity: formData.severity,
          estimatedResolution: getEstimatedResolution(formData.severity)
        }
      });

    } catch (error) {
      console.error('Error submitting report:', error);
      setErrors({ submit: 'Error al enviar el reporte. Por favor intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEstimatedResolution = (severity) => {
    const resolutionTimes = {
      low: '3-5 días hábiles',
      medium: '1-2 días hábiles',
      high: 'Mismo día',
      critical: 'Menos de 1 hora'
    };
    return resolutionTimes?.[severity] || '2-3 días hábiles';
  };

  // Update handlers (mantener igual que antes)
  const handleIncidentTypesChange = (types) => {
    setFormData(prev => ({ ...prev, incidentTypes: types }));
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const handleSeverityChange = (severity) => {
    setFormData(prev => ({ ...prev, severity }));
  };

  const handleDescriptionChange = (e) => {
    setFormData(prev => ({ ...prev, description: e?.target?.value }));
  };

  const handleTitleChange = (e) => {
    setFormData(prev => ({ ...prev, title: e?.target?.value }));
  };

  const handlePhotosChange = (photos) => {
    setFormData(prev => ({ ...prev, photos }));
  };

  const handleAccessibilityFeaturesChange = (features) => {
    setFormData(prev => ({ ...prev, accessibilityFeatures: features }));
  };

  const handleContactInfoChange = (contactInfo) => {
    setFormData(prev => ({ ...prev, contactInfo }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <IncidentTypeSelector
            selectedTypes={formData?.incidentTypes}
            onTypeChange={handleIncidentTypesChange}
            error={errors?.incidentTypes}
          />
        );
      case 2:
        return (
          <LocationPicker
            selectedLocation={formData?.location}
            onLocationChange={handleLocationChange}
            error={errors?.location}
          />
        );
      case 3:
        return (
          <SeveritySelector
            selectedSeverity={formData?.severity}
            onSeverityChange={handleSeverityChange}
            error={errors?.severity}
          />
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Descripción Detallada
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Describe el incidente con el mayor detalle posible para facilitar su resolución
              </p>
            </div>
            
            <Input
              label="Título del Incidente"
              type="text"
              placeholder="Ej: Ascensor fuera de servicio en Facultad de Mecánica"
              value={formData?.title}
              onChange={handleTitleChange}
              error={errors?.title}
              required
            />

            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Descripción del Incidente"
                  type="textarea"
                  placeholder="Describe qué pasó, cuándo ocurrió, cómo afecta la accesibilidad, y cualquier detalle relevante..."
                  value={formData?.description}
                  onChange={handleDescriptionChange}
                  error={errors?.description}
                  description="Mínimo 20 caracteres. Sé específico sobre el problema y su impacto."
                  className="min-h-32"
                  rows={6}
                  required
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceRecording}
                  loading={isVoiceRecording}
                  iconName="Mic"
                  iconPosition="left"
                  className="absolute bottom-3 right-3"
                >
                  {isVoiceRecording ? 'Grabando...' : 'Voz a Texto'}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Incluye información sobre:</p>
                <ul className="space-y-1">
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>¿Cuándo ocurrió el incidente?</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>¿Cómo afecta a las personas con discapacidad?</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>¿Hay alternativas temporales disponibles?</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>¿Has notado si el problema está empeorando?</span>
                  </li>
                </ul>
              </div>
            </div>
            <PhotoUpload
              photos={formData?.photos}
              onPhotosChange={handlePhotosChange}
              error={errors?.photos}
            />
          </div>
        );
      case 5:
        return (
          <AccessibilityFeatures
            selectedFeatures={formData?.accessibilityFeatures}
            onFeaturesChange={handleAccessibilityFeaturesChange}
            error={errors?.accessibilityFeatures}
          />
        );
      case 6:
        return (
          <ContactPreferences
            contactInfo={formData?.contactInfo}
            onContactChange={handleContactInfoChange}
            error={errors?.contactFullName || errors?.contactEmail || errors?.contactNotifications}
          />
        );
      default:
        return null;
    }
  };

  // Resto del componente se mantiene igual...
  return (
    <div className="min-h-screen bg-background">
      <Header userRole="student" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Reporte de Incidente
              </h1>
              <p className="text-muted-foreground">
                Reporta problemas de accesibilidad y barreras de movilidad
              </p>
            </div>
          </div>

          {location?.state?.emergency && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
              <div className="flex items-center space-x-2 text-destructive">
                <Icon name="AlertCircle" size={20} />
                <span className="font-medium">Modo de Emergencia Activado</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Este reporte será procesado con prioridad alta para atención inmediata.
              </p>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps?.map((step, index) => (
              <React.Fragment key={step?.id}>
                <div
                  className={`flex items-center space-x-2 cursor-pointer transition-all duration-200 ${
                    step?.id === currentStep
                      ? 'text-primary'
                      : step?.id < currentStep
                      ? 'text-success' :'text-muted-foreground'
                  }`}
                  onClick={() => handleStepClick(step?.id)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      step?.id === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step?.id < currentStep
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step?.id < currentStep ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      step?.id
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium">{step?.title}</p>
                  </div>
                </div>
                
                {index < steps?.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all duration-200 ${
                      step?.id < currentStep ? 'bg-success' : 'bg-border'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Paso {currentStep} de {totalSteps}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Anterior
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/student-dashboard')}
              iconName="X"
              iconPosition="left"
            >
              Cancelar
            </Button>

            {currentStep < totalSteps ? (
              <Button
                variant="default"
                onClick={handleNext}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleSubmit}
                loading={isSubmitting}
                iconName="Send"
                iconPosition="left"
              >
                Enviar Reporte
              </Button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {errors?.submit && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2 text-destructive">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm">{errors?.submit}</span>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="HelpCircle" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-2">
                ¿Necesitas Ayuda?
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Si tienes dificultades para completar este formulario o necesitas asistencia inmediata:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/request-assistance')}
                  iconName="Phone"
                  iconPosition="left"
                >
                  Solicitar Asistencia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('tel:+593987654321')}
                  iconName="PhoneCall"
                  iconPosition="left"
                >
                  Llamar: +593 98 765 4321
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReporting;