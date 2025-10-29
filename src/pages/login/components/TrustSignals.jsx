import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      id: 1,
      name: 'WCAG 2.1 AA',
      description: 'Cumplimiento de Accesibilidad Web',
      icon: 'Shield',
      verified: true
    },
    {
      id: 2,
      name: 'ISO 27001',
      description: 'Seguridad de la Información',
      icon: 'Lock',
      verified: true
    },
    {
      id: 3,
      name: 'ESPOCH Certificado',
      description: 'Sistema Institucional Oficial',
      icon: 'Award',
      verified: true
    },
    {
      id: 4,
      name: 'Accesibilidad Universal',
      description: 'Diseño Inclusivo Certificado',
      icon: 'Users',
      verified: true
    }
  ];

  const securityFeatures = [
    {
      id: 1,
      title: 'Encriptación SSL/TLS',
      description: 'Comunicación segura extremo a extremo',
      icon: 'ShieldCheck'
    },
    {
      id: 2,
      title: 'Autenticación Multifactor',
      description: 'Protección adicional de cuentas',
      icon: 'Smartphone'
    },
    {
      id: 3,
      title: 'Monitoreo 24/7',
      description: 'Supervisión continua de seguridad',
      icon: 'Eye'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Certifications Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Award" size={20} className="mr-2 text-primary" />
          Certificaciones y Cumplimiento
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications?.map((cert) => (
            <div
              key={cert?.id}
              className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name={cert?.icon} size={20} className="text-success" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-foreground">{cert?.name}</h4>
                  {cert?.verified && (
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{cert?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Features Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2 text-primary" />
          Características de Seguridad
        </h3>
        
        <div className="space-y-3">
          {securityFeatures?.map((feature) => (
            <div
              key={feature?.id}
              className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                <Icon name={feature?.icon} size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{feature?.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Institution Badge */}
      <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-primary-foreground"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">ESPOCH</h3>
            <p className="text-sm text-muted-foreground">Escuela Superior Politécnica de Chimborazo</p>
            <p className="text-xs text-primary font-medium mt-1">Sistema Oficial de Movilidad</p>
          </div>
        </div>
      </div>
      {/* Accessibility Statement */}
      <div className="text-center p-4 bg-card border border-border rounded-lg">
        <Icon name="Heart" size={24} className="text-error mx-auto mb-2" />
        <h4 className="text-sm font-medium text-foreground mb-1">
          Comprometidos con la Inclusión
        </h4>
        <p className="text-xs text-muted-foreground">
          Este sistema está diseñado para ser accesible para todas las personas,
          cumpliendo con los estándares internacionales de accesibilidad web.
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;