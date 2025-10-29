import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AssistanceTypeSelector from './components/AssistanceTypeSelector';
import LocationPicker from './components/LocationPicker';
import UrgencySelector from './components/UrgencySelector';
import AccessibilityNeeds from './components/AccessibilityNeeds';
import RequestForm from './components/RequestForm';
import ConfirmationModal from './components/ConfirmationModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const RequestAssistance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmergency = location.state?.emergency || false;

  // Form state
  const [assistanceType, setAssistanceType] = useState(isEmergency ? 'emergency' : '');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [urgencyLevel, setUrgencyLevel] = useState(isEmergency ? 'critical' : '');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState([]);
  const [communicationMethod, setCommunicationMethod] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [description, setDescription] = useState('');

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [correlationId, setCorrelationId] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [userRole] = useState('student');

  const totalSteps = 5;

  // Generate correlation ID
  const generateCorrelationId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `REQ-${timestamp}-${random}`.toUpperCase();
  };

  // Form validation - USAR useCallback PARA EVITAR RE-RENDERS
  const validateCurrentStep = useCallback(() => {
    const errors = {};

    switch (currentStep) {
      case 1:
        if (!assistanceType) {
          errors.assistanceType = 'Selecciona un tipo de asistencia';
        }
        break;
      case 2:
        if (!selectedLocation) {
          errors.location = 'Selecciona una ubicación';
        }
        break;
      case 3:
        if (!urgencyLevel) {
          errors.urgency = 'Selecciona un nivel de urgencia';
        }
        break;
      case 4:
        if (!communicationMethod) {
          errors.communicationMethod = 'Selecciona un método de comunicación';
        }
        break;
      case 5:
        if (!description || description.length < 20) {
          errors.description = 'La descripción debe tener al menos 20 caracteres';
        }
        if (description && description.length > 500) {
          errors.description = 'La descripción no puede exceder 500 caracteres';
        }
        break;
      default:
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentStep, assistanceType, selectedLocation, urgencyLevel, communicationMethod, description]);

  // Navigation handlers - CORREGIDOS
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    // Limpiar errores al retroceder
    setFormErrors({});
  };

  // CORREGIDO: Eliminar la validación del paso click para evitar loops
  const handleStepClick = (step) => {
    // Solo permitir navegar a pasos anteriores o actual
    if (step <= currentStep) {
      setCurrentStep(step);
      setFormErrors({});
    }
    // No permitir saltar a pasos futuros sin validar
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    try {
      const newCorrelationId = generateCorrelationId();
      setCorrelationId(newCorrelationId);

      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error submitting request:', error);
      setFormErrors({ submit: 'Error al enviar la solicitud. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirmation modal close
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/student-dashboard');
  };

  // Emergency mode setup - CORREGIDO para evitar loops
  useEffect(() => {
    if (isEmergency && currentStep === 1) {
      setAssistanceType('emergency');
      setUrgencyLevel('critical');
      setCurrentStep(2);
    }
  }, [isEmergency, currentStep]); // Agregar currentStep como dependencia

  // Step configuration
  const steps = [
    {
      id: 1,
      title: 'Tipo',
      description: 'Tipo de asistencia',
      icon: 'HelpCircle'
    },
    {
      id: 2,
      title: 'Ubicación',
      description: 'Dónde necesitas ayuda',
      icon: 'MapPin'
    },
    {
      id: 3,
      title: 'Urgencia',
      description: 'Nivel de prioridad',
      icon: 'Clock'
    },
    {
      id: 4,
      title: 'Accesibilidad',
      description: 'Necesidades específicas',
      icon: 'Accessibility'
    },
    {
      id: 5,
      title: 'Detalles',
      description: 'Descripción completa',
      icon: 'FileText'
    }
  ];

  const getEstimatedResponseTime = () => {
    const timeMap = {
      low: '2-4 horas',
      medium: '30-60 min',
      high: '10-20 min',
      critical: '< 5 min'
    };
    return timeMap[urgencyLevel] || '30-60 min';
  };

  const requestData = {
    assistanceType,
    location: selectedLocation,
    urgency: urgencyLevel,
    accessibilityNeeds,
    communicationMethod,
    specialRequirements,
    description
  };

  // Render simplificado para evitar loops
  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Emergency Banner */}
        {isEmergency && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={24} className="text-red-600" />
              <div>
                <h2 className="font-semibold text-red-800">Modo de Emergencia Activado</h2>
                <p className="text-sm text-red-700">
                  Tu solicitud será procesada con máxima prioridad.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Solicitar Asistencia
          </h1>
          <p className="text-muted-foreground">
            Completa el formulario para solicitar ayuda del personal de apoyo de ESPOCH
          </p>
        </div>

        {/* Progress Indicator - SIMPLIFICADO */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`
                    flex flex-col items-center space-y-2 p-2 rounded-lg transition-all duration-200
                    ${currentStep === step.id 
                      ? 'text-primary' 
                      : currentStep > step.id 
                        ? 'text-success hover:text-success/80' 
                        : 'text-muted-foreground'
                    }
                    ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                  `}
                  disabled={step.id > currentStep}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
                    ${currentStep === step.id 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : currentStep > step.id 
                        ? 'border-success bg-success text-success-foreground' 
                        : 'border-muted-foreground bg-background'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step.icon} size={16} />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium">{step.title}</div>
                    <div className="text-xs opacity-75 hidden sm:block">{step.description}</div>
                  </div>
                </button>
                
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-2 transition-all duration-200
                    ${currentStep > step.id ? 'bg-success' : 'bg-border'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          {currentStep === 1 && (
            <AssistanceTypeSelector
              selectedType={assistanceType}
              onTypeChange={setAssistanceType}
              error={formErrors.assistanceType}
            />
          )}

          {currentStep === 2 && (
            <LocationPicker
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              error={formErrors.location}
            />
          )}

          {currentStep === 3 && (
            <UrgencySelector
              selectedUrgency={urgencyLevel}
              onUrgencyChange={setUrgencyLevel}
              error={formErrors.urgency}
            />
          )}

          {currentStep === 4 && (
            <AccessibilityNeeds
              accessibilityNeeds={accessibilityNeeds}
              onAccessibilityChange={setAccessibilityNeeds}
              communicationMethod={communicationMethod}
              onCommunicationChange={setCommunicationMethod}
              specialRequirements={specialRequirements}
              onSpecialRequirementsChange={setSpecialRequirements}
              error={formErrors.communicationMethod}
            />
          )}

          {currentStep === 5 && (
            <RequestForm
              description={description}
              onDescriptionChange={setDescription}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              formErrors={formErrors}
            />
          )}

          {/* Error Messages */}
          {Object.keys(formErrors).length > 0 && (
            <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
                <div>
                  <h4 className="font-medium text-error mb-1">Errores en el formulario</h4>
                  <ul className="text-sm text-error space-y-1">
                    {Object.values(formErrors).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 ? (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Anterior
            </Button>

            <div className="text-sm text-muted-foreground">
              Paso {currentStep} de {totalSteps}
            </div>

            <Button
              variant="default"
              onClick={handleNext}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Siguiente
            </Button>
          </div>
        ) : null}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        requestData={requestData}
        correlationId={correlationId}
        estimatedResponseTime={getEstimatedResponseTime()}
      />
    </div>
  );
};

export default RequestAssistance;