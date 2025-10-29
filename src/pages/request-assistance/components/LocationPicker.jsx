import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationPicker = ({ selectedLocation, onLocationChange, className = "" }) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const campusBuildings = [
    {
      id: 'biblioteca-central',
      name: 'Biblioteca Central',
      code: 'BC',
      coordinates: { lat: -1.6508, lng: -78.6839 },
      accessibility: 'full',
      description: 'Acceso completo para sillas de ruedas, ascensores disponibles'
    },
    {
      id: 'facultad-informatica',
      name: 'Facultad de Informática y Electrónica',
      code: 'FIE',
      coordinates: { lat: -1.6512, lng: -78.6845 },
      accessibility: 'partial',
      description: 'Acceso limitado, rampa disponible en entrada principal'
    },
    {
      id: 'rectorado',
      name: 'Edificio del Rectorado',
      code: 'REC',
      coordinates: { lat: -1.6505, lng: -78.6835 },
      accessibility: 'full',
      description: 'Completamente accesible, múltiples entradas adaptadas'
    },
    {
      id: 'cafeteria-central',
      name: 'Cafetería Central',
      code: 'CAF',
      coordinates: { lat: -1.6515, lng: -78.6842 },
      accessibility: 'full',
      description: 'Acceso completo, mesas adaptadas disponibles'
    },
    {
      id: 'laboratorios-ciencias',
      name: 'Laboratorios de Ciencias',
      code: 'LAB',
      coordinates: { lat: -1.6510, lng: -78.6848 },
      accessibility: 'partial',
      description: 'Acceso limitado, asistencia requerida para algunos laboratorios'
    },
    {
      id: 'auditorio-principal',
      name: 'Auditorio Principal',
      code: 'AUD',
      coordinates: { lat: -1.6507, lng: -78.6837 },
      accessibility: 'full',
      description: 'Espacios reservados para sillas de ruedas, sistema de audio adaptado'
    }
  ];

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('La geolocalización no está disponible en este dispositivo');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const currentCoords = {
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude
        };
        
        onLocationChange({
          id: 'current-location',
          name: 'Mi Ubicación Actual',
          code: 'GPS',
          coordinates: currentCoords,
          accessibility: 'unknown',
          description: 'Ubicación actual obtenida por GPS'
        });
        
        setUseCurrentLocation(true);
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Error al obtener la ubicación';
        switch (error?.code) {
          case error?.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado';
            break;
          case error?.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible';
            break;
          case error?.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const getAccessibilityIcon = (level) => {
    switch (level) {
      case 'full':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'partial':
        return { icon: 'AlertCircle', color: 'text-warning' };
      default:
        return { icon: 'HelpCircle', color: 'text-muted-foreground' };
    }
  };

  const getAccessibilityLabel = (level) => {
    switch (level) {
      case 'full':
        return 'Totalmente Accesible';
      case 'partial':
        return 'Parcialmente Accesible';
      default:
        return 'Accesibilidad Desconocida';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Ubicación
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona tu ubicación actual o el lugar donde necesitas asistencia
        </p>
      </div>
      {/* Current Location Option */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={20} className="text-primary" />
            <span className="font-medium text-foreground">Usar Mi Ubicación Actual</span>
          </div>
          <Button
            variant={useCurrentLocation ? "default" : "outline"}
            size="sm"
            onClick={getCurrentLocation}
            loading={isLoadingLocation}
            iconName="Navigation"
            iconPosition="left"
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? 'Obteniendo...' : 'Obtener GPS'}
          </Button>
        </div>
        
        {locationError && (
          <div className="flex items-center space-x-2 text-sm text-error">
            <Icon name="AlertCircle" size={16} />
            <span>{locationError}</span>
          </div>
        )}
        
        {useCurrentLocation && selectedLocation?.id === 'current-location' && (
          <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-md">
            <div className="flex items-center space-x-2 text-sm text-success">
              <Icon name="CheckCircle" size={16} />
              <span>Ubicación actual obtenida exitosamente</span>
            </div>
          </div>
        )}
      </div>
      {/* Campus Buildings */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Edificios del Campus</h4>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {campusBuildings?.map((building) => {
            const accessibilityInfo = getAccessibilityIcon(building?.accessibility);
            const isSelected = selectedLocation?.id === building?.id;
            
            return (
              <button
                key={building?.id}
                onClick={() => {
                  onLocationChange(building);
                  setUseCurrentLocation(false);
                }}
                className={`
                  w-full p-4 rounded-lg border text-left transition-all duration-200
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border bg-card hover:border-muted-foreground hover:shadow-sm'
                  }
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                `}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`
                        text-xs font-mono px-2 py-1 rounded
                        ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                      `}>
                        {building?.code}
                      </span>
                      <h5 className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {building?.name}
                      </h5>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon 
                        name={accessibilityInfo?.icon} 
                        size={14} 
                        className={accessibilityInfo?.color} 
                      />
                      <span className={`text-xs ${accessibilityInfo?.color}`}>
                        {getAccessibilityLabel(building?.accessibility)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {building?.description}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <div className="ml-3">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Interactive Map */}
      {selectedLocation && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Map" size={20} className="text-primary" />
              <h4 className="font-medium text-foreground">Ubicación en el Mapa</h4>
            </div>
          </div>
          
          <div className="h-64 bg-muted relative">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={`Mapa de ${selectedLocation?.name}`}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${selectedLocation?.coordinates?.lat},${selectedLocation?.coordinates?.lng}&z=17&output=embed`}
              className="border-0"
            />
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {selectedLocation?.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lat: {selectedLocation?.coordinates?.lat?.toFixed(6)}, 
                Lng: {selectedLocation?.coordinates?.lng?.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;