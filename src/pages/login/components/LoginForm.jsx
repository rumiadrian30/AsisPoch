import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { AuthService } from '../../../services/apiService';

const LoginForm = ({ onLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setLoading(true);
    setErrors({});

    try {
      const result = await AuthService.login(formData.email, formData.password);

      if (result.success) {
        // Guardar en localStorage si seleccionó "Recordar sesión"
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', formData.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail');
        }

        if (onLogin) {
          await onLogin(result.data.user, result.data.user.userType);
        }

        // Navigate based on user type
        switch (result.data.user.userType) {
          case 'student': 
            navigate('/student-dashboard');
            break;
          case 'staff': 
          case 'admin': 
            navigate('/campus-incident-monitor');
            break;
          case 'volunteer': 
            navigate('/Volunteers');
            break;
          default:
            navigate('/student-dashboard');
        }
      } else {
        setErrors({
          general: result.error || 'Credenciales incorrectas'
        });
      }
    } catch (error) {
      console.error('Error en login:', error);
      setErrors({
        general: 'Error de conexión. Intente nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Función de recuperación de contraseña en desarrollo');
  };

  // Cargar datos guardados al montar el componente
  React.useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (rememberMe && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* General Error Message */}
      {errors?.general && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
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
        />
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
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
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
        />
        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80"
        >
          ¿Olvidó su contraseña?
        </button>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={loading}
        iconName="LogIn"
        iconPosition="right"
        fullWidth
        className="mt-8"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Demo Credentials Info */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2 text-primary" />
          Credenciales de Demostración
        </h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div><strong>Email:</strong> cualquiera de los listados abajo</div>
          <div><strong>Contraseña:</strong> password</div>
          <div className="mt-2">
            <strong>Usuarios disponibles:</strong><br/>
            • estudiante@espoch.edu.ec (Estudiante)<br/>
            • admin@espoch.edu.ec (Administrador)<br/>
            • voluntario@espoch.edu.ec (Voluntario)
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;