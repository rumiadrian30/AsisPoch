// contexts/AssistanceRequestContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AssistanceRequestService } from '../services/AssistanceRequestService';

const AssistanceRequestContext = createContext();

// Reducer para manejar el estado
const requestReducer = (state, action) => {
  switch (action.type) {
    case 'SET_REQUESTS':
      return {
        ...state,
        requests: action.payload,
        loading: false
      };
    
    case 'ADD_REQUEST':
      return {
        ...state,
        requests: [action.payload, ...state.requests]
      };
    
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(req =>
          req.id === action.payload.id ? action.payload : req
        )
      };
    
    case 'REMOVE_REQUEST':
      return {
        ...state,
        requests: state.requests.filter(req => req.id !== action.payload)
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'SET_SELECTED_REQUEST':
      return {
        ...state,
        selectedRequest: action.payload
      };
    
    case 'SET_ASSISTANCE_TYPES':
      return {
        ...state,
        assistanceTypes: action.payload
      };
    
    case 'SET_CAMPUS_LOCATIONS':
      return {
        ...state,
        campusLocations: action.payload
      };
    
    case 'SET_ACCESSIBILITY_NEEDS':
      return {
        ...state,
        accessibilityNeeds: action.payload
      };
    
    case 'SET_COMMUNICATION_METHODS':
      return {
        ...state,
        communicationMethods: action.payload
      };
    
    default:
      return state;
  }
};

const initialState = {
  requests: [],
  selectedRequest: null,
  assistanceTypes: [],
  campusLocations: [],
  accessibilityNeeds: [],
  communicationMethods: [],
  loading: false,
  error: null
};

export const AssistanceRequestProvider = ({ children, userId }) => {
  const [state, dispatch] = useReducer(requestReducer, initialState);

  // Cargar datos iniciales
  useEffect(() => {
    if (userId) {
      loadInitialData();
    }
  }, [userId]);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [requests, assistanceTypes, campusLocations, accessibilityNeeds, communicationMethods] = await Promise.all([
        AssistanceRequestService.getUserRequests(userId),
        AssistanceRequestService.getAssistanceTypes(),
        AssistanceRequestService.getCampusLocations(),
        AssistanceRequestService.getAccessibilityNeeds(),
        AssistanceRequestService.getCommunicationMethods()
      ]);

      if (requests.success) dispatch({ type: 'SET_REQUESTS', payload: requests.data });
      if (assistanceTypes.success) dispatch({ type: 'SET_ASSISTANCE_TYPES', payload: assistanceTypes.data });
      if (campusLocations.success) dispatch({ type: 'SET_CAMPUS_LOCATIONS', payload: campusLocations.data });
      if (accessibilityNeeds.success) dispatch({ type: 'SET_ACCESSIBILITY_NEEDS', payload: accessibilityNeeds.data });
      if (communicationMethods.success) dispatch({ type: 'SET_COMMUNICATION_METHODS', payload: communicationMethods.data });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createRequest = async (requestData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await AssistanceRequestService.createRequest({
        ...requestData,
        requester_id: userId
      });
      
      if (result.success) {
        dispatch({ type: 'ADD_REQUEST', payload: result.data });
        return result.data;
      } else {
        throw new Error(result.message || 'Error al crear la solicitud');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateRequest = async (requestId, updateData) => {
    try {
      const result = await AssistanceRequestService.updateRequest(requestId, updateData);
      
      if (result.success) {
        dispatch({ type: 'UPDATE_REQUEST', payload: result.data });
        return result.data;
      } else {
        throw new Error(result.message || 'Error al actualizar la solicitud');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      const result = await AssistanceRequestService.cancelRequest(requestId);
      
      if (result.success) {
        dispatch({ type: 'REMOVE_REQUEST', payload: requestId });
      } else {
        throw new Error(result.message || 'Error al cancelar la solicitud');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const selectRequest = (request) => {
    dispatch({ type: 'SET_SELECTED_REQUEST', payload: request });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const reloadRequests = () => {
    loadInitialData();
  };

  const value = {
    ...state,
    createRequest,
    updateRequest,
    cancelRequest,
    selectRequest,
    reloadRequests,
    clearError
  };

  return (
    <AssistanceRequestContext.Provider value={value}>
      {children}
    </AssistanceRequestContext.Provider>
  );
};

export const useAssistanceRequests = () => {
  const context = useContext(AssistanceRequestContext);
  if (!context) {
    throw new Error('useAssistanceRequests must be used within an AssistanceRequestProvider');
  }
  return context;
};