import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = ({ notifications, onMarkAsRead, onMarkAllAsRead, onNotificationClick }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'alerts', 'updates'

  const mockNotifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Incidente Reportado',
      message: 'Obstrucción temporal en la entrada principal de la Biblioteca. Se recomienda usar entrada lateral.',
      timestamp: new Date(Date.now() - 900000),
      isRead: false,
      severity: 'medium',
      actionRequired: true,
      relatedLocation: 'Biblioteca Central'
    },
    {
      id: 2,
      type: 'update',
      title: 'Solicitud Asignada',
      message: 'Tu solicitud de asistencia ha sido asignada a un personal autorizado. ETA: 5 minutos.',
      timestamp: new Date(Date.now() - 1800000),
      isRead: false,
      severity: 'low',
      actionRequired: false,
      staffMember: 'Rumi Grefa'
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Recordatorio de Cita',
      message: 'Tienes una cita con el Coordinador de Bienestar mañana a las 10:00 AM.',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
      severity: 'low',
      actionRequired: false,
      appointmentTime: new Date(Date.now() + 86400000)
    },
    {
      id: 4,
      type: 'system',
      title: 'Actualización de Preferencias',
      message: 'Tus preferencias de accesibilidad han sido actualizadas exitosamente.',
      timestamp: new Date(Date.now() - 7200000),
      isRead: true,
      severity: 'low',
      actionRequired: false
    },
    {
      id: 5,
      type: 'alert',
      title: 'Mantenimiento Programado',
      message: 'El ascensor del Edificio B estará fuera de servicio el viernes de 8:00 AM a 12:00 PM.',
      timestamp: new Date(Date.now() - 10800000),
      isRead: false,
      severity: 'high',
      actionRequired: true,
      scheduledDate: new Date(Date.now() + 172800000)
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return 'AlertTriangle';
      case 'update':
        return 'Bell';
      case 'appointment':
        return 'Calendar';
      case 'system':
        return 'Settings';
      default:
        return 'Info';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
  };

  const filteredNotifications = mockNotifications?.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification?.isRead;
      case 'alerts':
        return notification?.type === 'alert';
      case 'updates':
        return notification?.type === 'update' || notification?.type === 'system';
      default:
        return true;
    }
  });

  const unreadCount = mockNotifications?.filter(n => !n?.isRead)?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg text-foreground">Notificaciones</h3>
            {unreadCount > 0 && (
              <div className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </div>
            )}
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="CheckCheck"
              iconPosition="left"
              onClick={onMarkAllAsRead}
            >
              Marcar todas
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'all' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'unread' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            No leídas
          </button>
          <button
            onClick={() => setFilter('alerts')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'alerts' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Alertas
          </button>
        </div>
      </div>
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications?.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredNotifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                  !notification?.isRead ? 'bg-primary/5' : ''
                }`}
                onClick={() => {
                  onNotificationClick && onNotificationClick(notification);
                  if (!notification?.isRead) {
                    onMarkAsRead && onMarkAsRead(notification?.id);
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(notification?.severity)}`}>
                    <Icon name={getNotificationIcon(notification?.type)} size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-medium text-sm ${!notification?.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification?.title}
                      </h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatTimeAgo(notification?.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {notification?.message}
                    </p>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        {notification?.relatedLocation && (
                          <div className="flex items-center space-x-1">
                            <Icon name="MapPin" size={12} />
                            <span>{notification?.relatedLocation}</span>
                          </div>
                        )}
                        
                        {notification?.staffMember && (
                          <div className="flex items-center space-x-1">
                            <Icon name="User" size={12} />
                            <span>{notification?.staffMember}</span>
                          </div>
                        )}
                      </div>

                      {!notification?.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>

                    {/* Action Buttons */}
                    {notification?.actionRequired && (
                      <div className="mt-3 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Eye"
                          iconPosition="left"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onNotificationClick && onNotificationClick(notification);
                          }}
                        >
                          Ver Detalles
                        </Button>
                        
                        {notification?.type === 'alert' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Navigation"
                            iconPosition="left"
                            onClick={(e) => {
                              e?.stopPropagation();
                              // Navigate to alternative route
                            }}
                          >
                            Ruta Alternativa
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No hay notificaciones'}
            </p>
          </div>
        )}
      </div>
      {/* Footer */}
      {filteredNotifications?.length > 0 && (
        <div className="p-3 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            iconName="Archive"
            iconPosition="left"
            fullWidth
          >
            Ver Historial Completo
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;