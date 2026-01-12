import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import AccessibilityFeatures from './components/AccessibilityFeatures';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const navigate = useNavigate();

  // Check for saved language preference on load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Handle login submission
  const handleLogin = async (formData, userType) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user session data
      localStorage.setItem('userSession', JSON.stringify({
        email: formData?.email,
        userType: userType,
        loginTime: new Date()?.toISOString(),
        rememberMe: formData?.rememberMe
      }));
      
      // Store language preference
      localStorage.setItem('preferredLanguage', currentLanguage);
      
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new user registration navigation
  const handleRegisterClick = () => {
    // Mock registration - in real app would navigate to registration page
    alert('Para registrarse como nuevo usuario, contacte con la Oficina de Inclusión de ESPOCH o visite el Centro de Servicios Estudiantiles.');
  };

  // Handle accessibility panel toggle
  const toggleAccessibilityPanel = () => {
    setShowAccessibilityPanel(!showAccessibilityPanel);
  };

  return (
    <>
      <Helmet>
        <title>AsisPoch</title>
        <meta name="description" content="Acceso seguro al sistema de asistencia de movilidad del campus ESPOCH. Autenticación para estudiantes, personal y administradores." />
        <meta name="keywords" content="ESPOCH, login, accesibilidad, movilidad, campus, autenticación" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="/login" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
        {/* Accessibility Panel Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleAccessibilityPanel}
            className="bg-surface shadow-lg"
            aria-label="Abrir opciones de accesibilidad"
          >
            <Icon name="Accessibility" size={20} />
          </Button>
        </div>

        

        {/* Main Content */}
        <div className="flex min-h-screen">
          {/* Left Panel - Login Form */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              {/* Header */}
              <div className="text-center">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-9 h-9 text-primary-foreground"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Bienvenido a AsisPoch
                </h1>
                <p className="text-lg text-muted-foreground mb-1">
                  Sistema de Asistencia de Movilidad
                </p>
                <p className="text-sm text-muted-foreground">
                  Acceso seguro para estudiantes, voluntarios y administradores
                </p>
              </div>

              {/* Login Form */}
              <div className="bg-card p-8 rounded-2xl shadow-xl border border-border">
                <LoginForm onLogin={handleLogin} isLoading={isLoading} />
              </div>

              {/* Registration Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Nuevo usuario?{' '}
                  <button
                    onClick={handleRegisterClick}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Solicitar acceso
                  </button>
                </p>
              </div>

              {/* Emergency Contact */}
              <div className="bg-error/5 border border-error/20 rounded-lg p-4 text-center">
                <Icon name="Phone" size={20} className="text-error mx-auto mb-2" />
                <h3 className="text-sm font-medium text-error mb-1">
                  Emergencia o Asistencia Inmediata
                </h3>
                <p className="text-xs text-error/80 mb-2">
                  Si necesita ayuda urgente, contacte directamente:
                </p>
                <div className="space-y-1 text-xs">
                  <p className="font-medium">Seguridad Campus: (03) 2998-200 ext. 911</p>
                  <p className="font-medium">Oficina de Inclusión: (03) 2998-200 ext. 1234</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Trust Signals & Information */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-b from-primary/5 to-secondary/5 px-8">
            <div className="w-full max-w-lg">
              {/* Institution Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Sistema Oficial ESPOCH
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Plataforma institucional diseñada para brindar asistencia integral 
                  de movilidad y accesibilidad a toda la comunidad universitaria, 
                  garantizando un campus inclusivo y seguro para todos.
                </p>
              </div>

              {/* Trust Signals */}
              <TrustSignals />

              {/* Contact Information */}
              <div className="mt-8 p-6 bg-card rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="MapPin" size={20} className="mr-2 text-primary" />
                  Información de Contacto
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <Icon name="Building" size={16} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">ESPOCH</p>
                      <p className="text-muted-foreground">Escuela Superior Politécnica de Chimborazo</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">
                      Panamericana Sur Km 1½, Riobamba, Ecuador
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Phone" size={16} className="text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">
                      (03) 2998-200
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Mail" size={16} className="text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">
                      inclusion@espoch.edu.ec
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skip Links for Screen Readers */}
        <div className="sr-only">
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <a href="#login-form" className="skip-link">
            Ir al formulario de inicio de sesión
          </a>
        </div>

        {/* Main Content Landmark */}
        <main id="main-content" className="sr-only">
          <h1>Página de Inicio de Sesión - AsisPoch</h1>
        </main>
      </div>
    </>
  );
};

export default LoginPage;