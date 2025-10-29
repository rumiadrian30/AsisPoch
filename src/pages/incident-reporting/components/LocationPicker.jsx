import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LocationPicker = ({ selectedLocation, onLocationChange, error }) => {
  const [locationMethod, setLocationMethod] = useState('manual');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -1.6508, lng: -78.6839 }); // ESPOCH coordinates

  const campusBuildings = [
    { value: 'facultad-mecanica', label: 'Facultad de Mecánica' },
    { value: 'facultad-informatica', label: 'Facultad de Informática y Electrónica' },
    { value: 'facultad-recursos', label: 'Facultad de Recursos Naturales' },
    { value: 'facultad-ciencias', label: 'Facultad de Ciencias' },
    { value: 'biblioteca-central', label: 'Biblioteca Central' },
    { value: 'rectorado', label: 'Rectorado' },
    { value: 'comedor-estudiantil', label: 'Comedor Estudiantil' },
    { value: 'centro-medico', label: 'Centro Médico' },
    { value: 'auditorio-principal', label: 'Auditorio Principal' },
    { value: 'laboratorios-generales', label: 'Laboratorios Generales' }
  ];

  const campusAreas = [
    { value: 'entrada-principal', label: 'Entrada Principal' },
    { value: 'parqueadero-norte', label: 'Parqueadero Norte' },
    { value: 'parqueadero-sur', label: 'Parqueadero Sur' },
    { value: 'zona-deportiva', label: 'Zona Deportiva' },
    { value: 'jardin-botanico', label: 'Jardín Botánico' },
    { value: 'plaza-central', label: 'Plaza Central' },
    { value: 'senderos-peatonales', label: 'Senderos Peatonales' }
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          onLocationChange({
            ...selectedLocation,
            coordinates: { lat: latitude, lng: longitude },
            method: 'gps'
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          // Fallback to ESPOCH coordinates
          onLocationChange({
            ...selectedLocation,
            coordinates: mapCenter,
            method: 'manual'
          });
        }
      );
    } else {
      setIsGettingLocation(false);
      onLocationChange({
        ...selectedLocation,
        coordinates: mapCenter,
        method: 'manual'
      });
    }
  };

  const handleBuildingChange = (building) => {
    onLocationChange({
      ...selectedLocation,
      building,
      method: 'manual'
    });
  };

  const handleAreaChange = (area) => {
    onLocationChange({
      ...selectedLocation,
      area,
      method: 'manual'
    });
  };

  const handleDescriptionChange = (e) => {
    onLocationChange({
      ...selectedLocation,
      description: e?.target?.value
    });
  };

  const handleLandmarkChange = (e) => {
    onLocationChange({
      ...selectedLocation,
      nearbyLandmark: e?.target?.value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Ubicación del Incidente
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Proporciona la ubicación exacta donde ocurrió el incidente
        </p>
      </div>
      {/* Location Method Selection */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={locationMethod === 'gps' ? 'default' : 'outline'}
            onClick={() => {
              setLocationMethod('gps');
              getCurrentLocation();
            }}
            iconName="MapPin"
            iconPosition="left"
            loading={isGettingLocation}
            className="flex-1"
          >
            Usar Mi Ubicación Actual
          </Button>
          
          <Button
            variant={locationMethod === 'manual' ? 'default' : 'outline'}
            onClick={() => setLocationMethod('manual')}
            iconName="Map"
            iconPosition="left"
            className="flex-1"
          >
            Seleccionar Manualmente
          </Button>
        </div>

        {locationMethod === 'gps' && selectedLocation?.coordinates && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">
                Ubicación GPS obtenida exitosamente
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lat: {selectedLocation?.coordinates?.lat?.toFixed(6)}, 
              Lng: {selectedLocation?.coordinates?.lng?.toFixed(6)}
            </p>
          </div>
        )}
      </div>
      {/* Campus Map Integration */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Mapa del Campus</h4>
        <div className="w-full h-64 bg-muted rounded-lg overflow-hidden border">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Mapa del Campus ESPOCH"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=16&output=embed`}
            className="border-0"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Haz clic en el mapa para seleccionar la ubicación exacta del incidente
        </p>
      </div>
      {/* Building and Area Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Edificio o Facultad"
          placeholder="Selecciona un edificio"
          options={campusBuildings}
          value={selectedLocation?.building}
          onChange={handleBuildingChange}
          searchable
        />

        <Select
          label="Área Específica"
          placeholder="Selecciona un área"
          options={campusAreas}
          value={selectedLocation?.area}
          onChange={handleAreaChange}
          searchable
        />
      </div>
      {/* Additional Location Details */}
      <div className="space-y-4">
        <Input
          label="Descripción Detallada de la Ubicación"
          type="text"
          placeholder="Ej: Segundo piso, junto al ascensor principal, aula 201"
          value={selectedLocation?.description || ''}
          onChange={handleDescriptionChange}
          description="Proporciona detalles específicos para localizar fácilmente el incidente"
        />

        <Input
          label="Punto de Referencia Cercano"
          type="text"
          placeholder="Ej: Frente a la cafetería, cerca del baño principal"
          value={selectedLocation?.nearbyLandmark || ''}
          onChange={handleLandmarkChange}
          description="Menciona lugares conocidos que ayuden a identificar la ubicación"
        />
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm">
          <Icon name="AlertCircle" size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;