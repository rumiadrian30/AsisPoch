import BaseHandler from '../BaseHandler';

class DocumentationHandler extends BaseHandler {
  async handle(incidentContext) {
    console.log('📄 DocumentationHandler: Documentando incidente');
    this.addLog(incidentContext, 'Inicio documentación del incidente');
    
    try {
      // 1. Generar número de seguimiento oficial
      const trackingNumber = this.generateTrackingNumber(incidentContext);
      
      // 2. Crear resumen ejecutivo
      const executiveSummary = this.createExecutiveSummary(incidentContext);
      
      // 3. Preparar datos para base de datos
      const dbRecord = this.prepareDatabaseRecord(incidentContext);
      
      // 4. Crear historial de auditoría
      const auditTrail = this.createAuditTrail(incidentContext);
      
      // 5. Establecer metadatos finales
      incidentContext.data.documentation = {
        trackingNumber,
        executiveSummary,
        dbRecord,
        auditTrail,
        createdBy: incidentContext.data.contactInfo?.fullName || 'Anonymous',
        creationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // 6. Establecer tiempo estimado de resolución
      incidentContext.data.estimatedResolution = this.calculateResolutionTime(incidentContext);
      
      this.markProcessed(incidentContext);
      this.addLog(incidentContext, 'Documentación completada exitosamente');
      
    } catch (error) {
      this.addError(incidentContext, `DocumentationHandler error: ${error.message}`);
    }

    return await super.handle(incidentContext);
  }

  generateTrackingNumber(incidentContext) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    const severityCode = this.getSeverityCode(incidentContext.data.severity);
    
    return `INC-${severityCode}-${timestamp}-${random}`.toUpperCase();
  }

  getSeverityCode(severity) {
    const codes = {
      critical: 'CRIT',
      high: 'HIGH',
      medium: 'MED',
      low: 'LOW'
    };
    return codes[severity] || 'MED';
  }

  createExecutiveSummary(incidentContext) {
    const { data } = incidentContext;
    
    return {
      title: data.title || `Incidente reportado en ${data.location?.building || 'ubicación no especificada'}`,
      severity: data.severity,
      incidentTypes: data.incidentTypes,
      location: data.location,
      description: data.description?.substring(0, 200) + (data.description?.length > 200 ? '...' : ''),
      reporter: data.contactInfo?.fullName || 'Anónimo',
      estimatedResolution: this.calculateResolutionTime(incidentContext),
      priority: data.priority || 50
    };
  }

  prepareDatabaseRecord(incidentContext) {
    const { data } = incidentContext;
    
    return {
      title: data.title,
      description: data.description,
      incident_types: data.incidentTypes,
      severity: data.severity,
      location_building: data.location?.building,
      location_area: data.location?.area,
      location_coordinates: data.location?.coordinates,
      accessibility_features: data.accessibilityFeatures,
      contact_name: data.contactInfo?.fullName,
      contact_email: data.contactInfo?.email,
      contact_phone: data.contactInfo?.phone,
      notification_methods: data.contactInfo?.notificationMethods,
      photos_count: data.photos?.length || 0,
      status: 'reported',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  createAuditTrail(incidentContext) {
    return {
      reportedAt: new Date().toISOString(),
      processedBy: incidentContext.processedBy.map(p => ({
        handler: p.handler.replace('Handler', ''),
        timestamp: p.timestamp
      })),
      actions: incidentContext.history.map(h => ({
        handler: h.handler.replace('Handler', ''),
        action: h.action,
        timestamp: h.timestamp
      })),
      errors: incidentContext.errors,
      finalStatus: incidentContext.status
    };
  }

  calculateResolutionTime(incidentContext) {
    const resolutionTimes = {
      critical: 'Menos de 1 hora',
      high: 'Mismo día',
      medium: '1-2 días hábiles',
      low: '3-5 días hábiles'
    };
    
    // Ajustar según tipo de incidente
    let baseTime = resolutionTimes[incidentContext.data.severity] || '2-3 días hábiles';
    
    if (incidentContext.data.incidentTypes?.includes('structural_damage')) {
      baseTime = '1-3 días';
    }
    
    if (incidentContext.data.incidentTypes?.includes('elevator_outage')) {
      baseTime = '2-4 horas';
    }
    
    return baseTime;
  }
}

export default DocumentationHandler;