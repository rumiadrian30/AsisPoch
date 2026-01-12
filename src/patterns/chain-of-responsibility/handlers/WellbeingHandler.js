import BaseHandler from './BaseHandler';

class WellbeingHandler extends BaseHandler {
  canHandle(requestContext) {
    const { data } = requestContext;
    return data.assistanceType === 'wellbeing' ||
           (data.description && (
             data.description.toLowerCase().includes('salud') ||
             data.description.toLowerCase().includes('psicológico') ||
             data.description.toLowerCase().includes('emocional') ||
             data.description.toLowerCase().includes('apoyo')
           ));
  }

  async handle(requestContext) {
    if (!this.canHandle(requestContext)) {
      return await super.handle(requestContext);
    }

    console.log('💚 WellbeingHandler: Procesando solicitud de bienestar');
    this.addLog(requestContext, 'Inicio procesamiento de bienestar');
    
    try {
      // 1. Evaluar urgencia de bienestar
      const urgency = this.evaluateWellbeingUrgency(requestContext.data);
      
      // 2. Conectar con profesional adecuado
      await this.connectWithProfessional(requestContext, urgency);
      
      // 3. Programar seguimiento
      await this.scheduleFollowUp(requestContext);
      
      // 4. Proporcionar recursos de apoyo
      await this.provideSupportResources(requestContext);
      
      this.markProcessed(requestContext);
      this.addLog(requestContext, 'Bienestar procesado exitosamente');
      
    } catch (error) {
      this.addError(requestContext, `WellbeingHandler error: ${error.message}`);
    }

    return await super.handle(requestContext);
  }

  evaluateWellbeingUrgency(data) {
    const desc = data.description?.toLowerCase() || '';
    
    if (desc.includes('urgente') || desc.includes('crisis')) return 'high';
    if (desc.includes('ansiedad') || desc.includes('depresión')) return 'medium';
    return 'low';
  }

  async connectWithProfessional(requestContext, urgency) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const professionals = {
      high: { type: 'Psicólogo Clínico', responseTime: 'Inmediato' },
      medium: { type: 'Consejero Estudiantil', responseTime: '2 horas' },
      low: { type: 'Orientador', responseTime: '24 horas' }
    };
    
    requestContext.data.wellbeingSupport = {
      professional: professionals[urgency],
      urgency,
      contact: 'bienestar@espoch.edu.ec',
      phone: '1800-ESP0CH'
    };
    
    this.addLog(requestContext, `Conectado con profesional: ${urgency} urgency`);
  }

  async scheduleFollowUp(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    requestContext.data.followUp = {
      scheduled: true,
      initialSession: new Date(Date.now() + 86400000), // Mañana
      frequency: 'semanal',
      method: requestContext.data.communicationMethod || 'presencial'
    };
    
    this.addLog(requestContext, 'Seguimiento programado');
  }

  async provideSupportResources(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    requestContext.data.supportResources = [
      'Talleres de manejo de estrés',
      'Grupos de apoyo',
      'Línea de ayuda 24/7',
      'Recursos digitales de autocuidado'
    ];
    
    this.addLog(requestContext, 'Recursos de apoyo proporcionados');
  }
}

export default WellbeingHandler;