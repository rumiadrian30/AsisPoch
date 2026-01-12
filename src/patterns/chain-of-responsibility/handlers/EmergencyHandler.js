import BaseHandler from './BaseHandler';

class EmergencyHandler extends BaseHandler {
  canHandle(requestContext) {
    const { data } = requestContext;
    return data.assistanceType === 'emergency' || 
           data.urgency === 'critical' ||
           data.urgencyLevel === 'critical';
  }

  async handle(requestContext) {
    if (!this.canHandle(requestContext)) {
      return await super.handle(requestContext);
    }

    console.log('🔴 EmergencyHandler: Procesando solicitud de emergencia');
    this.addLog(requestContext, 'Inicio procesamiento de emergencia');
    
    try {
      // 1. Marcar como prioridad máxima
      requestContext.data.priority = 100;
      requestContext.data.isEmergency = true;
      
      // 2. Agregar metadatos de emergencia
      requestContext.data.emergencyMetadata = {
        notifiedTeams: ['security', 'medical', 'administration'],
        activationTime: new Date(),
        protocol: 'ESP0CH-EMERGENCY-2024'
      };

      // 3. Simular notificaciones
      await this.simulateEmergencyNotifications(requestContext);
      
      this.markProcessed(requestContext);
      this.addLog(requestContext, 'Emergencia procesada exitosamente');
      
    } catch (error) {
      this.addError(requestContext, `EmergencyHandler error: ${error.message}`);
    }

    return await super.handle(requestContext);
  }

  async simulateEmergencyNotifications(requestContext) {
    // Simular notificación al equipo de emergencia
    await new Promise(resolve => setTimeout(resolve, 500));
    this.addLog(requestContext, 'Equipos de emergencia notificados');
  }
}

export default EmergencyHandler;