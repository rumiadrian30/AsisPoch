import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import Button from './ui/Button';
import Icon from './AppIcon';

const DebugPanel = () => {
  const [health, setHealth] = useState(null);
  const [incidents, setIncidents] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const result = await ApiService.checkHealth();
      setHealth(result);
    } catch (error) {
      setHealth({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const result = await ApiService.getDebugIncidents();
      setIncidents(result);
    } catch (error) {
      setIncidents({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-semibold text-foreground mb-3 flex items-center">
        <Icon name="Settings" size={16} className="mr-2" />
        Panel de Debug
      </h3>
      
      {/* Estado de la BD */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Base de Datos:</span>
          {health?.database?.connected ? (
            <span className="text-success text-sm flex items-center">
              <Icon name="Check" size={12} className="mr-1" />
              Conectada
            </span>
          ) : (
            <span className="text-destructive text-sm flex items-center">
              <Icon name="X" size={12} className="mr-1" />
              Desconectada
            </span>
          )}
        </div>
        
        {health?.database?.connected && (
          <div className="text-xs text-muted-foreground">
            <div>Incidentes: {health.database.incidents_count}</div>
            <div>Hora BD: {new Date(health.database.time).toLocaleTimeString()}</div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={checkHealth}
          loading={loading}
          className="text-xs"
        >
          Verificar BD
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={loadIncidents}
          loading={loading}
          className="text-xs"
        >
          Ver Incidentes
        </Button>
      </div>

      {/* Lista de incidentes */}
      {incidents?.success && incidents.data && (
        <div className="mt-3 max-h-40 overflow-y-auto">
          <h4 className="text-xs font-medium mb-2">Incidentes en BD:</h4>
          {incidents.data.map(incident => (
            <div key={incident.id} className="text-xs border-b border-border py-1">
              <div className="font-medium">#{incident.tracking_number}</div>
              <div className="text-muted-foreground truncate">{incident.title}</div>
              <div className="flex justify-between">
                <span>{incident.status}</span>
                <span>{new Date(incident.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;