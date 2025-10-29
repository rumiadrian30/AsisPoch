import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapContainer = ({ 
  currentLocation, 
  destination, 
  selectedRoute, 
  accessibilityFilters, 
  onLocationUpdate,
  onRouteSelect,
  incidents = [],
  isVoiceEnabled = false 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(currentLocation);
  const [zoomLevel, setZoomLevel] = useState(16);
  const [mapStyle, setMapStyle] = useState('standard');

  // Mock route data with accessibility information
  const mockRoutes = [
    {
      id: 'route-1',
      name: 'Ruta Principal Accesible',
      distance: '450m',
      duration: '6 min',
      accessibilityLevel: 'high',
      features: ['Rampa disponible', 'Superficie lisa', 'Iluminación adecuada'],
      coordinates: [
        { lat: -1.6508, lng: -78.6839 },
        { lat: -1.6512, lng: -78.6835 },
        { lat: -1.6515, lng: -78.6831 }
      ],
      incidents: []
    },
    {
      id: 'route-2',
      name: 'Ruta Alternativa',
      distance: '520m',
      duration: '8 min',
      accessibilityLevel: 'medium',
      features: ['Superficie irregular', 'Pendiente moderada'],
      coordinates: [
        { lat: -1.6508, lng: -78.6839 },
        { lat: -1.6510, lng: -78.6832 },
        { lat: -1.6515, lng: -78.6831 }
      ],
      incidents: ['incident-1']
    }
  ];

  // Handle GPS location updates
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation?.watchPosition(
        (position) => {
          const newLocation = {
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude,
            accuracy: position?.coords?.accuracy
          };
          setUserLocation(newLocation);
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
          }
        },
        (error) => {
          console.warn('GPS error:', error?.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );

      return () => navigator.geolocation?.clearWatch(watchId);
    }
  }, [onLocationUpdate]);

  // Handle map zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 10));
  };

  // Handle map style toggle
  const toggleMapStyle = () => {
    setMapStyle(prev => prev === 'standard' ? 'satellite' : 'standard');
  };

  // Handle route selection
  const handleRouteClick = (route) => {
    if (onRouteSelect) {
      onRouteSelect(route);
    }
  };

  // Get route color based on accessibility level
  const getRouteColor = (level) => {
    switch (level) {
      case 'high': return '#10B981'; // emerald-500
      case 'medium': return '#F59E0B'; // amber-500
      case 'low': return '#EF4444'; // red-500
      default: return '#6B7280'; // gray-500
    }
  };

  // Mock campus location for iframe
  const campusLat = -1.6508;
  const campusLng = -78.6839;

  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="w-full h-full">
        <iframe
          ref={mapRef}
          width="100%"
          height="100%"
          loading="lazy"
          title="ESPOCH Campus Navigation Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${campusLat},${campusLng}&z=${zoomLevel}&output=embed`}
          onLoad={() => setMapLoaded(true)}
          className="w-full h-full border-0"
        />
      </div>
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        {/* Zoom Controls */}
        <div className="bg-surface border border-border rounded-lg shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="rounded-b-none border-b border-border"
            aria-label="Acercar mapa"
          >
            <Icon name="Plus" size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="rounded-t-none"
            aria-label="Alejar mapa"
          >
            <Icon name="Minus" size={18} />
          </Button>
        </div>

        {/* Map Style Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMapStyle}
          className="bg-surface shadow-lg"
          aria-label={`Cambiar a vista ${mapStyle === 'standard' ? 'satélite' : 'estándar'}`}
        >
          <Icon name={mapStyle === 'standard' ? 'Satellite' : 'Map'} size={18} />
        </Button>

        {/* Center on User Location */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (userLocation && onLocationUpdate) {
              onLocationUpdate(userLocation);
            }
          }}
          className="bg-surface shadow-lg"
          aria-label="Centrar en mi ubicación"
        >
          <Icon name="Navigation" size={18} />
        </Button>
      </div>
      {/* Route Options Overlay */}
      {mockRoutes?.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-surface border border-border rounded-lg shadow-lg p-4 max-h-48 overflow-y-auto">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Rutas Disponibles
            </h3>
            <div className="space-y-2">
              {mockRoutes?.map((route) => (
                <button
                  key={route?.id}
                  onClick={() => handleRouteClick(route)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    selectedRoute?.id === route?.id
                      ? 'border-primary bg-primary/5' :'border-border bg-background hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getRouteColor(route?.accessibilityLevel) }}
                      />
                      <span className="font-medium text-sm text-foreground">
                        {route?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{route?.distance}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{route?.duration}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {route?.features?.slice(0, 2)?.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {route?.incidents?.length > 0 && (
                      <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded flex items-center space-x-1">
                        <Icon name="AlertTriangle" size={10} />
                        <span>Incidente reportado</span>
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
      )}
      {/* GPS Accuracy Indicator */}
      {userLocation?.accuracy && (
        <div className="absolute top-4 left-4 bg-surface border border-border rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              userLocation?.accuracy < 10 ? 'bg-success' : 
              userLocation?.accuracy < 50 ? 'bg-warning' : 'bg-error'
            }`} />
            <span className="text-xs text-muted-foreground">
              GPS: ±{Math.round(userLocation?.accuracy)}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;