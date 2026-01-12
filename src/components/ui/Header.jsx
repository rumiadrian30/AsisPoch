import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ 
  userRole = 'student', 
  userEmail = '', 
  userName = '', 
  onEmergencyRequest, 
  onRoleSwitch, 
  onLogout,
  accessibilityConfig = {} 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [activeRequests, setActiveRequests] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Función para determinar la ruta del dashboard según el rol
  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return '/campus-incident-monitor';
      case 'staff':
        return '/campus-incident-monitor';
      case 'volunteer':
        return '/volunteers';
      case 'student':
      default:
        return '/student-dashboard';
    }
  };

  // Función para obtener el label del dashboard según el rol
  const getDashboardLabel = () => {
    switch (userRole) {
      case 'admin':
        return 'Panel Admin';
      case 'staff':
        return 'Monitor Campus';
      case 'volunteer':
        return 'Portal Voluntarios';
      case 'student':
      default:
        return 'Mi Dashboard';
    }
  };

  // Función para obtener el título del sistema según el rol
  const getSystemTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Sistema de Gestión - Administrador';
      case 'staff':
        return 'Monitor de Incidentes - Personal';
      case 'volunteer':
        return 'Portal de Voluntarios - ESPOCH';
      case 'student':
      default:
        return 'AsisPoch - Estudiante';
    }
  };

  // Función para obtener el nombre del rol en español
  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin':
        return 'Administrador';
      case 'staff':
        return 'Personal ESPOCH';
      case 'volunteer':
        return 'Voluntario';
      case 'student':
      default:
        return 'Estudiante';
    }
  };

  // Función para obtener el icono del dashboard según el rol
  const getDashboardIcon = () => {
    switch (userRole) {
      case 'admin':
        return 'Settings';
      case 'staff':
        return 'Monitor';
      case 'volunteer':
        return 'Users';
      case 'student':
      default:
        return 'LayoutDashboard';
    }
  };

  // Navigation items based on role and workflow priority
  const primaryNavItems = [
    {
      label: getDashboardLabel(),
      path: getDashboardPath(),
      icon: getDashboardIcon(),
      roles: ['student', 'staff', 'admin', 'volunteer']
    },
    {
      label: 'Solicitar Ayuda',
      path: '/request-assistance',
      icon: 'HelpCircle',
      roles: ['student', 'staff', 'admin', 'volunteer'],
      isEmergencyAccess: true
    },
    {
      label: 'Navegación',
      path: '/route-navigation',
      icon: 'Navigation',
      roles: ['student', 'staff', 'admin', 'volunteer']
    },
    {
      label: 'Reportar Incidente',
      path: '/incident-reporting',
      icon: 'AlertTriangle',
      roles: ['student', 'staff', 'admin', 'volunteer']
    },
    {
      label: 'Gestión Avanzada',
      path: '/admin-dashboard',
      icon: 'Settings',
      roles: ['admin']
    }
  ];

  const secondaryNavItems = [
    {
      label: 'Estadísticas',
      path: '/statistics',
      icon: 'BarChart3',
      roles: ['admin', 'staff']
    },
    {
      label: 'Gestión de Usuarios',
      path: '/user-management',
      icon: 'Users',
      roles: ['admin']
    },
    {
      label: 'Configuración',
      path: '/settings',
      icon: 'Settings',
      roles: ['admin', 'staff']
    }
  ];

  // Filter navigation items based on user role
  const visiblePrimaryItems = primaryNavItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const visibleSecondaryItems = secondaryNavItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  // Handle navigation with role-based routing
  const handleNavigation = (path) => {
    // Si es el dashboard, usar la ruta basada en el rol
    if (path === '/student-dashboard' || path === '/campus-incident-monitor' || path === '/volunteers') {
      navigate(getDashboardPath());
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  // Handle emergency help button
  const handleEmergencyHelp = () => {
    setIsEmergencyMode(true);
    if (onEmergencyRequest) {
      onEmergencyRequest();
    }
    navigate('/request-assistance', { state: { emergency: true } });
  };

  // Handle role switching for staff/admin
  const handleRoleSwitch = (newRole) => {
    if (onRoleSwitch) {
      onRoleSwitch(newRole);
    }
    setIsMoreMenuOpen(false);
    
    // Redirigir al dashboard apropiado después del cambio de rol
    setTimeout(() => {
      navigate(getDashboardPath());
    }, 100);
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  }, [location?.pathname]);

  // Simulate WebSocket connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'connected' : 'disconnected');
      setActiveRequests(Math.floor(Math.random() * 5));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event, action) => {
    if (event?.key === 'Enter' || event?.key === ' ') {
      event?.preventDefault();
      action();
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.mobile-menu') && !event?.target?.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
      if (!event?.target?.closest('.more-menu') && !event?.target?.closest('.more-menu-button')) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determinar si el item actual está activo
  const isItemActive = (item) => {
    if (item.path === '/student-dashboard' || item.path === '/campus-incident-monitor' || item.path === '/volunteers') {
      return location.pathname === getDashboardPath();
    }
    return location.pathname === item.path;
  };

  return (
    <>
      <header className="sticky top-0 z-100 bg-surface border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading font-semibold text-lg text-foreground">
                  {getSystemTitle()}
                </h1>
                <p className="font-caption text-xs text-muted-foreground -mt-1">
                  ESPOCH - Sistema de Accesibilidad
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {visiblePrimaryItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isItemActive(item) ? "default" : "ghost"}
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={18}
                className="px-4 py-2"
              >
                {item?.label}
              </Button>
            ))}

            {/* More Menu for Secondary Items */}
            {visibleSecondaryItems?.length > 0 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  iconName="MoreHorizontal"
                  iconPosition="left"
                  iconSize={18}
                  className="more-menu-button px-4 py-2"
                  aria-expanded={isMoreMenuOpen}
                  aria-haspopup="true"
                >
                  Más
                </Button>

                {isMoreMenuOpen && (
                  <div className="more-menu absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-lg animate-slide-down z-50">
                    <div className="py-1" role="menu">
                      {visibleSecondaryItems?.map((item) => (
                        <button
                          key={item?.path}
                          onClick={() => handleNavigation(item?.path)}
                          className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          role="menuitem"
                        >
                          <Icon name={item?.icon} size={16} className="mr-3" />
                          {item?.label}
                        </button>
                      ))}
                      
                      {/* Role Switcher for Staff/Admin */}
                      {(userRole === 'staff' || userRole === 'admin') && (
                        <>
                          <div className="border-t border-border my-1" />
                          <div className="px-4 py-2">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Cambiar Vista</p>
                            <div className="space-y-1">
                              <button
                                onClick={() => handleRoleSwitch('student')}
                                className={`flex items-center w-full px-2 py-1 text-sm rounded transition-colors ${
                                  userRole === 'student' 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'text-popover-foreground hover:bg-accent'
                                }`}
                              >
                                <Icon name="User" size={14} className="mr-2" />
                                Vista Estudiante
                              </button>
                              <button
                                onClick={() => handleRoleSwitch('staff')}
                                className={`flex items-center w-full px-2 py-1 text-sm rounded transition-colors ${
                                  userRole === 'staff' 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'text-popover-foreground hover:bg-accent'
                                }`}
                              >
                                <Icon name="Users" size={14} className="mr-2" />
                                Vista Personal
                              </button>
                              {userRole === 'admin' && (
                                <button
                                  onClick={() => handleRoleSwitch('admin')}
                                  className={`flex items-center w-full px-2 py-1 text-sm rounded transition-colors ${
                                    userRole === 'admin' 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'text-popover-foreground hover:bg-accent'
                                  }`}
                                >
                                  <Icon name="Shield" size={14} className="mr-2" />
                                  Vista Administrador
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Real-time Status Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-success' : 'bg-error'
                }`} />
                <span className="text-xs font-caption text-muted-foreground">
                  {connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              
              {activeRequests > 0 && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-warning/10 rounded-full">
                  <Icon name="Bell" size={14} className="text-warning" />
                  <span className="text-xs font-medium text-warning">
                    {activeRequests}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>

            {/* User Profile */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={14} className="text-primary-foreground" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {userName || getRoleLabel()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userEmail || getRoleLabel()}
                </p>
              </div>
              
              {/* Menú desplegable del usuario */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
                  aria-label="Opciones de usuario"
                >
                  <Icon name="ChevronDown" size={14} />
                </button>
                
                {/* Opciones del menú de usuario */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{userName || getRoleLabel()}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="User" size={14} />
                    <span>Mi Perfil</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="Settings" size={14} />
                    <span>Configuración</span>
                  </button>
                  
                  <div className="border-t border-border" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center space-x-2 text-destructive"
                  >
                    <Icon name="LogOut" size={14} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu lg:hidden bg-surface border-t border-border animate-slide-down">
            <nav className="px-4 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
              {visiblePrimaryItems?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isItemActive(item) ? "default" : "ghost"}
                  onClick={() => handleNavigation(item?.path)}
                  iconName={item?.icon}
                  iconPosition="left"
                  fullWidth
                  className="justify-start"
                >
                  {item?.label}
                </Button>
              ))}

              {visibleSecondaryItems?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isItemActive(item) ? "default" : "ghost"}
                  onClick={() => handleNavigation(item?.path)}
                  iconName={item?.icon}
                  iconPosition="left"
                  fullWidth
                  className="justify-start"
                >
                  {item?.label}
                </Button>
              ))}

              {/* Role Switcher for Mobile */}
              {(userRole === 'staff' || userRole === 'admin') && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2 px-3">Cambiar Vista:</p>
                  <div className="space-y-1">
                    <Button
                      variant={userRole === 'student' ? "default" : "outline"}
                      onClick={() => handleRoleSwitch('student')}
                      fullWidth
                      className="justify-start"
                    >
                      Vista Estudiante
                    </Button>
                    <Button
                      variant={userRole === 'staff' ? "default" : "outline"}
                      onClick={() => handleRoleSwitch('staff')}
                      fullWidth
                      className="justify-start"
                    >
                      Vista Personal
                    </Button>
                    {userRole === 'admin' && (
                      <Button
                        variant={userRole === 'admin' ? "default" : "outline"}
                        onClick={() => handleRoleSwitch('admin')}
                        fullWidth
                        className="justify-start"
                      >
                        Vista Administrador
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Información del usuario en móvil */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center space-x-3 px-3 py-2 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {userName || getRoleLabel()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userEmail || getRoleLabel()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Status Indicator */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-success' : 'bg-error'
                    }`} />
                    <span className="text-sm font-caption text-muted-foreground">
                      {connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  
                  {activeRequests > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Bell" size={16} className="text-warning" />
                      <span className="text-sm font-medium text-warning">
                        {activeRequests}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de cerrar sesión en móvil */}
              <Button
                variant="outline"
                onClick={handleLogout}
                fullWidth
                className="justify-start text-destructive border-destructive/20"
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Cerrar Sesión
              </Button>
            </nav>
          </div>
        )}
      </header>
      
      {/* Emergency Help Button - Fixed Position */}
      <Button
        variant="destructive"
        size="lg"
        onClick={handleEmergencyHelp}
        onKeyDown={(e) => handleKeyDown(e, handleEmergencyHelp)}
        iconName="Phone"
        iconPosition="left"
        className="fixed bottom-20 right-4 z-200 shadow-lg hover:shadow-xl transition-shadow min-h-44 px-6"
        aria-label="Emergency assistance - Get immediate help"
      >
        <span className="hidden sm:inline">Ayuda de Emergencia</span>
        <span className="sm:hidden">Emergencia</span>
      </Button>
    </>
  );
};

export default Header;