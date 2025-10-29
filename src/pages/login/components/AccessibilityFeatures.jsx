import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccessibilityFeatures = () => {
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  const accessibilityOptions = [
    {
      id: 'font-size',
      title: 'Tamaño de Fuente',
      description: 'Ajustar el tamaño del texto para mejor legibilidad',
      icon: 'Type',
      options: [
        { value: 'small', label: 'Pequeño', size: 'text-sm' },
        { value: 'normal', label: 'Normal', size: 'text-base' },
        { value: 'large', label: 'Grande', size: 'text-lg' },
        { value: 'extra-large', label: 'Extra Grande', size: 'text-xl' }
      ]
    },
    {
      id: 'contrast',
      title: 'Alto Contraste',
      description: 'Mejorar la visibilidad con colores de alto contraste',
      icon: 'Contrast',
      toggle: true
    },
    {
      id: 'screen-reader',
      title: 'Modo Lector de Pantalla',
      description: 'Optimizar para tecnologías de asistencia',
      icon: 'Volume2',
      toggle: true
    }
  ];

  const keyboardShortcuts = [
    {
      keys: 'Tab',
      description: 'Navegar entre elementos interactivos'
    },
    {
      keys: 'Enter / Espacio',
      description: 'Activar botones y enlaces'
    },
    {
      keys: 'Esc',
      description: 'Cerrar menús y diálogos'
    },
    {
      keys: 'Alt + 1',
      description: 'Ir al contenido principal'
    },
    {
      keys: 'Alt + 2',
      description: 'Ir al menú de navegación'
    }
  ];

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size adjustment
    root.classList?.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    const sizeClass = accessibilityOptions?.[0]?.options?.find(opt => opt?.value === fontSize)?.size || 'text-base';
    root.classList?.add(sizeClass);
    
    // High contrast mode
    if (highContrast) {
      root.classList?.add('high-contrast');
    } else {
      root.classList?.remove('high-contrast');
    }
    
    // Screen reader mode
    if (screenReaderMode) {
      root.classList?.add('screen-reader-mode');
    } else {
      root.classList?.remove('screen-reader-mode');
    }
  }, [fontSize, highContrast, screenReaderMode]);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    // Announce change to screen readers
    const announcement = `Tamaño de fuente cambiado a ${size}`;
    announceToScreenReader(announcement);
  };

  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement?.setAttribute('aria-live', 'polite');
    announcement?.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body?.appendChild(announcement);
    
    setTimeout(() => {
      document.body?.removeChild(announcement);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Accessibility Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Accessibility" size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Opciones de Accesibilidad
        </h2>
        <p className="text-sm text-muted-foreground">
          Personalice su experiencia para una mejor accesibilidad
        </p>
      </div>
      {/* Font Size Controls */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <Icon name="Type" size={16} className="mr-2" />
          Tamaño de Fuente
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {accessibilityOptions?.[0]?.options?.map((option) => (
            <Button
              key={option?.value}
              variant={fontSize === option?.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFontSizeChange(option?.value)}
              className="text-xs"
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Toggle Controls */}
      <div className="space-y-4">
        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="Contrast" size={20} className="text-foreground" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Alto Contraste</h4>
              <p className="text-xs text-muted-foreground">Mejorar visibilidad</p>
            </div>
          </div>
          <button
            onClick={() => {
              setHighContrast(!highContrast);
              announceToScreenReader(`Alto contraste ${!highContrast ? 'activado' : 'desactivado'}`);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              highContrast ? 'bg-primary' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={highContrast}
            aria-label="Alternar alto contraste"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Screen Reader Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="Volume2" size={20} className="text-foreground" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Lector de Pantalla</h4>
              <p className="text-xs text-muted-foreground">Optimizar para asistencia</p>
            </div>
          </div>
          <button
            onClick={() => {
              setScreenReaderMode(!screenReaderMode);
              announceToScreenReader(`Modo lector de pantalla ${!screenReaderMode ? 'activado' : 'desactivado'}`);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              screenReaderMode ? 'bg-primary' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={screenReaderMode}
            aria-label="Alternar modo lector de pantalla"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                screenReaderMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      {/* Keyboard Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <Icon name="Keyboard" size={16} className="mr-2" />
          Atajos de Teclado
        </h3>
        <div className="space-y-2">
          {keyboardShortcuts?.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="font-mono bg-muted px-2 py-1 rounded text-foreground">
                {shortcut?.keys}
              </span>
              <span className="text-muted-foreground flex-1 ml-3">
                {shortcut?.description}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Skip Links (Hidden but available for screen readers) */}
      <div className="sr-only">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <a href="#navigation" className="skip-link">
          Saltar a la navegación
        </a>
      </div>
      {/* ARIA Live Region for Announcements */}
      <div
        id="accessibility-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
};

export default AccessibilityFeatures;