import BaseHandler from './BaseHandler';

class NotificationHandler extends BaseHandler {
  async handle(requestContext) {
    console.log('📢 NotificationHandler: Enviando notificaciones');
    this.addLog(requestContext, 'Inicio envío de notificaciones');
    
    try {
      // 1. Notificar al usuario
      await this.notifyUser(requestContext);
      
      // 2. Notificar al personal según tipo de solicitud
      await this.notifyStaff(requestContext);
      
      // 3. Registrar en sistema de monitoreo
      await this.logToMonitoringSystem(requestContext);
      
      this.markProcessed(requestContext);
      this.addLog(requestContext, 'Notificaciones enviadas exitosamente');
      
    } catch (error) {
      this.addError(requestContext, `NotificationHandler error: ${error.message}`);
    }

    return await super.handle(requestContext);
  }

  async notifyUser(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    requestContext.data.userNotification = {
      sent: true,
      method: requestContext.data.communicationMethod || 'email',
      message: `Tu solicitud ${requestContext.data.correlationId} ha sido procesada`,
      timestamp: new Date()
    };
    
    this.addLog(requestContext, 'Usuario notificado');
  }

  async notifyStaff(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const staffByType = {
      emergency: ['security@espoch.edu.ec', 'emergency@espoch.edu.ec'],
      mobility: ['mobility@espoch.edu.ec', 'accessibility@espoch.edu.ec'],
      academic: ['academic@espoch.edu.ec', departmentEmail(requestContext.data)],
      wellbeing: ['wellbeing@espoch.edu.ec', 'counseling@espoch.edu.ec'],
      default: ['support@espoch.edu.ec']
    };
    
    const type = requestContext.data.assistanceType || 'default';
    const recipients = staffByType[type] || staffByType.default;
    
    requestContext.data.staffNotification = {
      recipients,
      sent: true,
      priority: requestContext.data.priority || 50
    };
    
    this.addLog(requestContext, `Personal notificado: ${recipients.length} destinatarios`);
  }

  async logToMonitoringSystem(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    requestContext.data.monitoringLog = {
      system: 'ESP0CH-Monitoring',
      logged: true,
      reference: requestContext.data.correlationId,
      category: requestContext.data.assistanceType || 'general'
    };
    
    this.addLog(requestContext, 'Registrado en sistema de monitoreo');
  }
}

function departmentEmail(data) {
  // Lógica para determinar el departamento según la descripción
  if (data.description?.includes('ingeniería')) return 'engineering@espoch.edu.ec';
  if (data.description?.includes('medicina')) return 'medicine@espoch.edu.ec';
  if (data.description?.includes('administración')) return 'business@espoch.edu.ec';
  return 'general@espoch.edu.ec';
}

export default NotificationHandler;