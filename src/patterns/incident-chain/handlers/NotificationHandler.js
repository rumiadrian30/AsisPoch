import BaseHandler from '../BaseHandler';

class NotificationHandler extends BaseHandler {
  async handle(incidentContext) {
    console.log('📢 IncidentNotificationHandler: Enviando notificaciones');
    this.addLog(incidentContext, 'Inicio envío de notificaciones');
    
    try {
      // 1. Notificar al reporter
      await this.notifyReporter(incidentContext);
      
      // 2. Notificar a departamentos relevantes
      await this.notifyDepartments(incidentContext);
      
      // 3. Notificar a seguridad si es necesario
      if (this.requiresSecurityNotification(incidentContext.data)) {
        await this.notifySecurity(incidentContext);
      }
      
      // 4. Notificar a administración si es crítico
      if (incidentContext.data.severity === 'critical' || 
          incidentContext.data.severity === 'high') {
        await this.notifyAdministration(incidentContext);
      }
      
      // 5. Registrar todas las notificaciones
      incidentContext.data.notifications = {
        sent: true,
        timestamp: new Date(),
        recipients: this.getAllRecipients(incidentContext.data)
      };
      
      this.markProcessed(incidentContext);
      this.addLog(incidentContext, 'Notificaciones enviadas exitosamente');
      
    } catch (error) {
      this.addError(incidentContext, `NotificationHandler error: ${error.message}`);
    }

    return await super.handle(incidentContext);
  }

  async notifyReporter(incidentContext) {
    const { data } = incidentContext;
    const contactInfo = data.contactInfo || {};
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    incidentContext.data.reporterNotification = {
      sent: true,
      method: contactInfo.notificationMethods?.[0] || 'email',
      trackingNumber: data.documentation?.trackingNumber,
      message: `Tu reporte ha sido registrado con número de seguimiento: ${data.documentation?.trackingNumber}`,
      estimatedResolution: data.estimatedResolution
    };
    
    this.addLog(incidentContext, 'Reporter notificado');
  }

  async notifyDepartments(incidentContext) {
    const departments = this.getRelevantDepartments(incidentContext.data);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    incidentContext.data.departmentNotifications = departments.map(dept => ({
      department: dept.name,
      contact: dept.email,
      priority: incidentContext.data.severity,
      assigned: true
    }));
    
    this.addLog(incidentContext, `${departments.length} departamentos notificados`);
  }

  getRelevantDepartments(incidentData) {
    const departments = [];
    
    if (incidentData.incidentTypes?.some(type => 
      ['elevator_outage', 'ramp_blocked', 'door_obstruction'].includes(type)
    )) {
      departments.push({ name: 'Accesibilidad', email: 'accessibility@espoch.edu.ec' });
    }
    
    if (incidentData.incidentTypes?.some(type => 
      ['structural_damage', 'electrical', 'plumbing'].includes(type)
    )) {
      departments.push({ name: 'Mantenimiento', email: 'maintenance@espoch.edu.ec' });
    }
    
    if (incidentData.severity === 'critical') {
      departments.push({ name: 'Seguridad', email: 'security@espoch.edu.ec' });
    }
    
    if (incidentData.incidentTypes?.includes('medical_emergency')) {
      departments.push({ name: 'Servicios Médicos', email: 'medical@espoch.edu.ec' });
    }
    
    return departments;
  }

  requiresSecurityNotification(incidentData) {
    return incidentData.severity === 'critical' || 
           incidentData.incidentTypes?.includes('safety_hazard') ||
           incidentData.incidentTypes?.includes('security_breach');
  }

  async notifySecurity(incidentContext) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    incidentContext.data.securityNotification = {
      sent: true,
      level: incidentContext.data.severity === 'critical' ? 'ALERTA ROJA' : 'ALERTA AMARILLA',
      responseTeam: 'Patrulla de Seguridad',
      estimatedArrival: '5-10 minutos'
    };
    
    this.addLog(incidentContext, 'Seguridad notificada');
  }

  async notifyAdministration(incidentContext) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    incidentContext.data.adminNotification = {
      sent: true,
      recipients: ['director@espoch.edu.ec', 'admin@espoch.edu.ec'],
      summary: incidentContext.data.documentation?.executiveSummary?.title,
      severity: incidentContext.data.severity
    };
    
    this.addLog(incidentContext, 'Administración notificada');
  }

  getAllRecipients(incidentData) {
    const recipients = [];
    
    // Reporter
    if (incidentData.contactInfo?.email) {
      recipients.push(incidentData.contactInfo.email);
    }
    
    // Departments
    if (incidentData.departmentNotifications) {
      incidentData.departmentNotifications.forEach(dept => {
        recipients.push(dept.contact);
      });
    }
    
    // Security if needed
    if (incidentData.securityNotification) {
      recipients.push('security@espoch.edu.ec');
    }
    
    // Administration for high severity
    if (incidentData.adminNotification) {
      recipients.push(...incidentData.adminNotification.recipients);
    }
    
    return [...new Set(recipients)];
  }
}

export default NotificationHandler;