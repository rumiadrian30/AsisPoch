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
  badge 
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
        {/* Badge */}
        {badge && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-warning-foreground">{badge}</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor.replace('bg-', 'bg-').replace('/5', '/20')}`}>
            <Icon name={icon} size={20} className={iconColor} />
          </div>
          
          {/* Info Button */}
          <button 
            onClick={handleInfoClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded"
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
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
              <Icon name={icon} size={24} className={iconColor} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">Funcionalidad disponible</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Descripción</h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {description}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Qué puedes hacer</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
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
            </ul>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              onClick={() => {
                handleUseFunction();
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Usar esta función
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuickActionCard;