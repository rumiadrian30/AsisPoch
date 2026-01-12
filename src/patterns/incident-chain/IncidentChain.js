import EmergencyIncidentHandler from './handlers/EmergencyIncidentHandler';
import AccessibilityIncidentHandler from './handlers/AccessibilityIncidentHandler';
import InfrastructureIncidentHandler from './handlers/InfrastructureIncidentHandler';
import DocumentationHandler from './handlers/DocumentationHandler';
import NotificationHandler from './handlers/NotificationHandler';
import IncidentContext from './IncidentContext';

/**
 * Cadena de responsabilidad para procesamiento de incidentes
 */
class IncidentChain {
  constructor() {
    this.chain = this.buildChain();
  }

  buildChain() {
    // Construir la cadena en orden de prioridad
    const emergency = new EmergencyIncidentHandler();
    const accessibility = new AccessibilityIncidentHandler();
    const infrastructure = new InfrastructureIncidentHandler();
    const documentation = new DocumentationHandler();
    const notification = new NotificationHandler();

    // Configurar la cadena
    emergency.setNext(accessibility)
            .setNext(infrastructure)
            .setNext(documentation)
            .setNext(notification);
    
    return emergency;
  }

  async processIncident(incidentData) {
    console.log('🔗 IncidentChain: Iniciando procesamiento de incidente...');
    
    // Crear contexto del incidente
    const incidentContext = new IncidentContext(incidentData);
    
    try {
      // Ejecutar la cadena
      await this.chain.handle(incidentContext);
      
      // Marcar como completado exitosamente
      incidentContext.setResult({
        success: true,
        message: 'Incidente procesado exitosamente por la cadena de responsabilidad',
        trackingNumber: incidentContext.data.documentation?.trackingNumber,
        estimatedResolution: incidentContext.data.estimatedResolution,
        processedHandlers: incidentContext.processedBy.map(p => p.handler),
        totalHandlers: incidentContext.processedBy.length
      });
      
      console.log('✅ IncidentChain: Procesamiento completado');
      console.log('📊 Resumen:', {
        trackingNumber: incidentContext.data.documentation?.trackingNumber,
        handlers: incidentContext.processedBy.map(p => p.handler),
        duration: incidentContext.metadata.duration,
        status: incidentContext.status
      });
      
      return incidentContext;
      
    } catch (error) {
      console.error('❌ IncidentChain Error:', error);
      
      incidentContext.setResult({
        success: false,
        error: error.message,
        timestamp: new Date()
      }, 'failed');
      
      return incidentContext;
    }
  }

  getChainInfo() {
    return {
      handlers: ['Emergency', 'Accessibility', 'Infrastructure', 'Documentation', 'Notification'],
      order: 'Emergency → Accessibility → Infrastructure → Documentation → Notification',
      description: 'Cadena de responsabilidad para procesamiento de incidentes ESPOCH',
      version: '1.0.0'
    };
  }
}

export default IncidentChain;