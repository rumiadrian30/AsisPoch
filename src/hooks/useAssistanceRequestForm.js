// hooks/useAssistanceRequestForm.js
import { useState, useCallback } from 'react';
import { useAssistanceRequests } from '../contexts/AssistanceRequestContext.jsx';

export const useAssistanceRequestForm = () => {
  const { 
    createRequest, 
    loading, 
    error,
    assistanceTypes,
    campusLocations,
    accessibilityNeeds,
    communicationMethods
  } = useAssistanceRequests();
  
  const [formData, setFormData] = useState({
    assistance_type: '',
    location: null,
    urgency_level: '',
    accessibility_needs: [],
    communication_method: '',
    special_requirements: '',
    description: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  // Validaciones
  const validateStep = useCallback((step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!formData.assistance_type) {
          errors.assistance_type = 'Selecciona un tipo de asistencia';
        }
        break;
      
      case 2:
        if (!formData.location) {
          errors.location = 'Selecciona una ubicación';
        }
        break;
      
      case 3:
        if (!formData.urgency_level) {
          errors.urgency_level = 'Selecciona un nivel de urgencia';
        }
        break;
      
      case 4:
        if (!formData.communication_method) {
          errors.communication_method = 'Selecciona un método de comunicación';
        }
        break;
      
      case 5:
        if (!formData.description || formData.description.length < 20) {
          errors.description = 'La descripción debe tener al menos 20 caracteres';
        }
        if (formData.description && formData.description.length > 500) {
          errors.description = 'La descripción no puede exceder 500 caracteres';
        }
        break;
      
      default:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Navegación del formulario
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setFormErrors({});
  }, []);

  const goToStep = useCallback((step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setFormErrors({});
    }
  }, [currentStep]);

  // Manejo de cambios en el formulario
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Envío del formulario
  const submitForm = useCallback(async () => {
    if (!validateStep(5)) return null;

    try {
      const requestData = {
        assistance_type: formData.assistance_type,
        title: getRequestTitle(formData.assistance_type),
        description: formData.description,
        urgency_level: formData.urgency_level,
        priority: getPriorityFromUrgency(formData.urgency_level),
        location_building: formData.location?.name,
        location_area: formData.location?.area,
        location_coordinates: formData.location?.coordinates 
          ? `(${formData.location.coordinates.lat}, ${formData.location.coordinates.lng})`
          : null,
        accessibility_needs: formData.accessibility_needs,
        communication_method: formData.communication_method,
        special_requirements: formData.special_requirements,
        is_emergency: formData.urgency_level === 'critical'
      };

      const result = await createRequest(requestData);
      return result;
    } catch (err) {
      console.error('Error submitting form:', err);
      throw err;
    }
  }, [formData, createRequest, validateStep]);

  // Helper functions
  const getRequestTitle = (assistanceType) => {
    const type = assistanceTypes.find(t => t.type_key === assistanceType);
    return type?.label || 'Solicitud de Asistencia';
  };

  const getPriorityFromUrgency = (urgency) => {
    const priorityMap = {
      low: 'low',
      medium: 'medium',
      high: 'high',
      critical: 'critical'
    };
    return priorityMap[urgency] || 'medium';
  };

  return {
    formData,
    currentStep,
    formErrors,
    loading,
    error,
    assistanceTypes,
    campusLocations,
    accessibilityNeeds,
    communicationMethods,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    validateStep
  };
};