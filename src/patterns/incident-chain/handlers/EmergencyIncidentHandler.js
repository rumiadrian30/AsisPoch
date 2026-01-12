import BaseHandler from '../BaseHandler';

class EmergencyIncidentHandler extends BaseHandler {
  canHandle(incidentContext) {
    const { data } = incidentContext;
    return data.severity === 'critical' || 
           data.emergency === true ||
           data.incidentTypes?.includes('safety_hazard') ||
           data.incidentTypes?.includes('medical_emergency');
  }

  async handle(incidentContext) {
    if (!this.canHandle(incidentContext)) {
      return await super.handle(incidentContext);
    }

    console.log('🚨 EmergencyIncidentHandler: Procesando incidente crítico');
    this.addLog(incidentContext, 'Inicio procesamiento de emergencia');
    
    try {
      // 1. Marcar como prioridad máxima
      incidentContext.data.priority = 100;
      incidentContext.data.isEmergency = true;
      
      // 2. Activar protocolos de seguridad
      await this.activateSafetyProtocols(incidentContext);
      
      // 3. Notificar equipos de respuesta
      await this.notifyEmergencyTeams(incidentContext);
      
      // 4. Establecer tiempo de respuesta inmediato
      incidentContext.data.estimatedResponseTime = 'INMEDIATO';
      incidentContext.data.responseTeam = 'Equipo de Respuesta Rápida ESPOCH';
      
      this.markProcessed(incidentContext);
      this.addLog(incidentContext, 'Incidente crítico procesado exitosamente');
      
    } catch (error) {
      this.addError(incidentContext, `EmergencyIncidentHandler error: ${error.message}`);
    }

    return await super.handle(incidentContext);
  }

  async activateSafetyProtocols(incidentContext) {
    await new Promise(resolve => setTimeout(resolve, 400));
    this.addLog(incidentContext, 'Protocolos de seguridad activados');
  }

  async notifyEmergencyTeams(incidentContext) {
    const teams = this.getEmergencyTeams(incidentContext.data);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    incidentContext.data.notifiedTeams = teams;
    this.addLog(incidentContext, `Equipos notificados: ${teams.join(', ')}`);
  }

  getEmergencyTeams(incidentData) {
    const teams = ['security', 'medical'];
    
    if (incidentData.incidentTypes?.includes('fire')) teams.push('fire_department');
    if (incidentData.incidentTypes?.includes('structural_damage')) teams.push('engineering');
    if (incidentData.incidentTypes?.includes('chemical')) teams.push('hazmat');
    
    return teams;
  }
}

export default EmergencyIncidentHandler;