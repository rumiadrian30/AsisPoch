import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Modal from '../../../components/ui/Modal';

const QuickActionCard = ({ 
  title, 
  description, 
  icon, 
  iconColor, 
  bgColor, 
  borderColor, 
  onClick,
  badge,
  chainBadge // Nueva prop para indicar uso de Chain of Responsibility
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleClick = () => {
    setShowInfoModal(true);
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowInfoModal(true);
  };

  const handleUseFunction = () => {
    setShowInfoModal(false);
    if (onClick) {
      onClick(); // Solo aquí ejecuta la navegación
    }
  };

  return (
    <>
      <div 
        className={`bg-card border ${borderColor} rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group relative ${bgColor}`}
        onClick={handleClick}
      >
        {/* Badge para notificaciones */}
        {badge && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-warning-foreground">{badge}</span>
          </div>
        )}

        {/* Badge para Chain of Responsibility */}
        {chainBadge && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-white" title="Chain of Responsibility">🏗️</span>
            </div>
            <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        )}

        {/* Ajustar posición del botón de info si hay badge */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor.replace('bg-', 'bg-').replace('/5', '/20')}`}>
            <Icon name={icon} size={20} className={iconColor} />
          </div>
          
          {/* Info Button - posicionado según badges */}
          <button 
            onClick={handleInfoClick}
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded ${
              (badge || chainBadge) ? 'mr-6' : ''
            }`}
            aria-label="Más información"
          >
            <Icon name="Info" size={16} className="text-muted-foreground" />
          </button>
        </div>

        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
        </div>
      </div>

      {/* Modal de Información */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={title}
        size="md"
      >
        <div className="p-6 space-y-4">
          {/* Header con icono y título */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
              <Icon name={icon} size={24} className={iconColor} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground text-lg">{title}</h3>
                {chainBadge && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    🏗️ Chain of Responsibility
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Funcionalidad disponible</p>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Descripción</h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {description}
            </p>
          </div>

          {/* Sección especial para Chain of Responsibility */}
          {chainBadge && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="GitBranch" size={16} className="text-blue-600" />
                <h4 className="font-medium text-blue-800">Procesado con Chain of Responsibility</h4>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Esta función utiliza un patrón de diseño avanzado que procesa automáticamente 
                tu solicitud a través de múltiples handlers especializados.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded border border-blue-200">
                  <div className="font-medium text-blue-700">5 handlers</div>
                  <div className="text-blue-600">Especializados</div>
                </div>
                <div className="bg-white p-2 rounded border border-blue-200">
                  <div className="font-medium text-blue-700">Automático</div>
                  <div className="text-blue-600">Procesamiento</div>
                </div>
              </div>
            </div>
          )}

          {/* Qué puedes hacer */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Qué puedes hacer</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {chainBadge ? (
                <>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Reportar incidentes de accesibilidad</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Procesamiento automático con múltiples handlers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Notificaciones automáticas a departamentos relevantes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Seguimiento completo del procesamiento</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Solicitar asistencia inmediata</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Recibir actualizaciones en tiempo real</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Comunicarte con el personal asignado</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end pt-4 border-t border-border">
            <button
              onClick={() => {
                handleUseFunction();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                chainBadge 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {chainBadge ? 'Usar Chain of Responsibility' : 'Usar esta función'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuickActionCard;