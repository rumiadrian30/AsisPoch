import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Mock credentials for different user types
  const mockCredentials = {
    student: { email: 'estudiante@espoch.edu.ec', password: 'Estudiante2024!' },
    staff: { email: 'personal@espoch.edu.ec', password: 'Personal2024!' },
    admin: { email: 'admin@espoch.edu.ec', password: 'Admin2024!' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    
    if (!formData?.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check against mock credentials
    const userType = Object.keys(mockCredentials)?.find(type => 
      mockCredentials?.[type]?.email === formData?.email && 
      mockCredentials?.[type]?.password === formData?.password
    );

    if (!userType) {
      setErrors({
        general: 'Credenciales incorrectas. Use: estudiante@espoch.edu.ec / Estudiante2024! o personal@espoch.edu.ec / Personal2024! o admin@espoch.edu.ec / Admin2024!'
      });
      return;
    }

    if (onLogin) {
      await onLogin(formData, userType);
    }

    // Navigate based on user type
    switch (userType) {
      case 'student': navigate('/student-dashboard');
        break;
      case 'staff': navigate('/campus-incident-monitor');
        break;
      case 'admin': navigate('/campus-incident-monitor');
        break;
      default:
        navigate('/student-dashboard');
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Se ha enviado un enlace de recuperación a su correo electrónico');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* General Error Message */}
      {errors?.general && (
        <div 
          className="p-4 bg-error/10 border border-error/20 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
            <p className="text-sm text-error font-medium">{errors?.general}</p>
          </div>
        </div>
      )}
      {/* Email Field */}
      <div>
        <Input
          type="email"
          name="email"
          label="Correo Electrónico"
          placeholder="ejemplo@espoch.edu.ec"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          autoComplete="email"
          aria-describedby="email-help"
          className="w-full"
        />
        <p id="email-help" className="mt-1 text-xs text-muted-foreground">
          Use su correo institucional de ESPOCH
        </p>
      </div>
      {/* Password Field */}
      <div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            autoComplete="current-password"
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>
      </div>
      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <Checkbox
          name="rememberMe"
          label="Recordar sesión"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          className="text-sm"
        />
        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          ¿Olvidó su contraseña?
        </button>
      </div>
      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
        fullWidth
        className="mt-8"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
      {/* Demo Credentials Info */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2 text-primary" />
          Credenciales de Demostración
        </h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div>
            <strong>Estudiante:</strong> estudiante@espoch.edu.ec / Estudiante2024!
          </div>
          <div>
            <strong>Personal:</strong> personal@espoch.edu.ec / Personal2024!
          </div>
          <div>
            <strong>Administrador:</strong> admin@espoch.edu.ec / Admin2024!
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;