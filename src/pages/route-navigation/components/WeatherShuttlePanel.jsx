import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeatherShuttlePanel = ({ onEmergencyContact }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [shuttleData, setShuttleData] = useState([]);

  // Mock weather data
  const mockWeatherData = {
    temperature: 18,
    condition: 'partly-cloudy',
    humidity: 65,
    windSpeed: 12,
    description: 'Parcialmente nublado',
    uvIndex: 6,
    visibility: 'Buena',
    alerts: []
  };

  // Mock shuttle information
  const mockShuttleData = [
    {
      id: 'shuttle-1',
      name: 'Ruta Campus Norte',
      nextArrival: '5 min',
      accessibility: 'Accesible para sillas de ruedas',
      status: 'En ruta',
      capacity: 'Disponible',
      stops: ['Administración', 'Ciencias', 'Biblioteca', 'Cafetería']
    },
    {
      id: 'shuttle-2',
      name: 'Ruta Campus Sur',
      nextArrival: '12 min',
      accessibility: 'Accesible para sillas de ruedas',
      status: 'En ruta',
      capacity: 'Lleno',
      stops: ['Ingeniería', 'Laboratorios', 'Deportes', 'Residencias']
    }
  ];

  // Emergency contacts
  const emergencyContacts = [
    {
      id: 'security',
      name: 'Seguridad Campus',
      phone: '032-998-200',
      type: 'Emergencia General',
      icon: 'Shield'
    },
    {
      id: 'medical',
      name: 'Enfermería',
      phone: '032-998-201',
      type: 'Emergencia Médica',
      icon: 'Heart'
    },
    {
      id: 'accessibility',
      name: 'Asistencia Movilidad',
      phone: '032-998-202',
      type: 'Apoyo Accesibilidad',
      icon: 'Accessibility'
    }
  ];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Set initial weather and shuttle data
    setWeatherData(mockWeatherData);
    setShuttleData(mockShuttleData);

    return () => clearInterval(timer);
  }, []);

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return 'Sun';
      case 'partly-cloudy': return 'CloudSun';
      case 'cloudy': return 'Cloud';
      case 'rainy': return 'CloudRain';
      case 'stormy': return 'CloudLightning';
      default: return 'Sun';
    }
  };

  // Handle emergency contact
  const handleEmergencyContact = (contact) => {
    if (onEmergencyContact) {
      onEmergencyContact(contact);
    }
    // In a real app, this would initiate a call or open communication
    window.open(`tel:${contact?.phone}`, '_self');
  };

  // Format time in Spanish locale
  const formatTime = (date) => {
    return date?.toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="space-y-4">
      {/* Weather Information */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <Icon name={getWeatherIcon(weatherData?.condition)} size={18} />
            <span>Condiciones Actuales</span>
          </h3>
          <span className="text-sm text-muted-foreground">
            {formatTime(currentTime)}
          </span>
        </div>

        {weatherData && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Temperatura</span>
                <span className="font-medium text-foreground">
                  {weatherData?.temperature}°C
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Humedad</span>
                <span className="font-medium text-foreground">
                  {weatherData?.humidity}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Viento</span>
                <span className="font-medium text-foreground">
                  {weatherData?.windSpeed} km/h
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Condición</span>
                <span className="font-medium text-foreground">
                  {weatherData?.description}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">UV</span>
                <span className="font-medium text-foreground">
                  {weatherData?.uvIndex}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visibilidad</span>
                <span className="font-medium text-foreground">
                  {weatherData?.visibility}
                </span>
              </div>
            </div>
          </div>
        )}

        {weatherData?.alerts?.length > 0 && (
          <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-warning" />
              <span className="text-sm font-medium text-warning">
                Alerta Meteorológica
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Campus Shuttle Information */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground flex items-center space-x-2 mb-3">
          <Icon name="Bus" size={18} />
          <span>Transporte Campus</span>
        </h3>

        <div className="space-y-3">
          {shuttleData?.map((shuttle) => (
            <div
              key={shuttle?.id}
              className="p-3 border border-border rounded-lg bg-background"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    shuttle?.status === 'En ruta' ? 'bg-success' : 'bg-warning'
                  }`} />
                  <span className="font-medium text-sm text-foreground">
                    {shuttle?.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-primary">
                  {shuttle?.nextArrival}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                <div className="flex items-center space-x-1">
                  <Icon name="Accessibility" size={10} />
                  <span>Accesible</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name={shuttle?.capacity === 'Disponible' ? 'Users' : 'UserX'} size={10} />
                  <span>{shuttle?.capacity}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {shuttle?.stops?.slice(0, 3)?.map((stop, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                  >
                    {stop}
                  </span>
                ))}
                {shuttle?.stops?.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded">
                    +{shuttle?.stops?.length - 3} más
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          iconName="MapPin"
          iconPosition="left"
          className="w-full mt-3"
        >
          Ver Todas las Rutas
        </Button>
      </div>
      {/* Emergency Contacts */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground flex items-center space-x-2 mb-3">
          <Icon name="Phone" size={18} />
          <span>Contactos de Emergencia</span>
        </h3>

        <div className="space-y-2">
          {emergencyContacts?.map((contact) => (
            <Button
              key={contact?.id}
              variant="outline"
              onClick={() => handleEmergencyContact(contact)}
              className="w-full justify-start p-3 h-auto"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={contact?.icon} size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm text-foreground">
                    {contact?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {contact?.type} • {contact?.phone}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-3 p-2 bg-muted rounded text-center">
          <p className="text-xs text-muted-foreground">
            En caso de emergencia, presiona el botón "Emergency Help" en la parte superior
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherShuttlePanel;