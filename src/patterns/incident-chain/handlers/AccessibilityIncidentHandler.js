import BaseHandler from '../BaseHandler';

class AccessibilityIncidentHandler extends BaseHandler {
  canHandle(incidentContext) {
    const { data } = incidentContext;
    return data.incidentTypes?.some(type => 
      ['elevator_outage', 'ramp_blocked', 'door_obstruction', 'pathway_blocked'].includes(type)
    ) || data.accessibilityFeatures?.length > 0;
  }

  async handle(incidentContext) {
    if (!this.canHandle(incidentContext)) {
      return await super.handle(incidentContext);
    }

    console.log('♿ AccessibilityIncidentHandler: Procesando incidente de accesibilidad');
    this.addLog(incidentContext, 'Inicio procesamiento de accesibilidad');
    
    try {
      // 1. Identificar características afectadas
      const affectedFeatures = this.identifyAffectedFeatures(incidentContext.data);
      
      // 2. Evaluar impacto en movilidad
      const mobilityImpact = this.evaluateMobilityImpact(incidentContext.data);
      
      // 3. Proponer rutas alternativas
      const alternativeRoutes = await this.findAlternativeRoutes(incidentContext.data);
      
      // 4. Asignar recursos si es necesario
      if (this.requiresImmediateAction(incidentContext.data)) {
        await this.assignAccessibilityResources(incidentContext);
      }
      
      // 5. Registrar metadatos
      incidentContext.data.accessibilityAnalysis = {
        affectedFeatures,
        mobilityImpact,
        alternativeRoutes,
        estimatedFixTime: this.estimateFixTime(incidentContext.data),
        priority: this.calculateAccessibilityPriority(incidentContext.data)
      };
      
      this.markProcessed(incidentContext);
      this.addLog(incidentContext, 'Incidente de accesibilidad procesado');
      
    } catch (error) {
      this.addError(incidentContext, `AccessibilityIncidentHandler error: ${error.message}`);
    }

    return await super.handle(incidentContext);
  }

  identifyAffectedFeatures(incidentData) {
    const affected = [];
    
    if (incidentData.incidentTypes?.includes('elevator_outage')) {
      affected.push('elevator', 'vertical_mobility');
    }
    if (incidentData.incidentTypes?.includes('ramp_blocked')) {
      affected.push('ramp', 'wheelchair_access');
    }
    if (incidentData.incidentTypes?.includes('door_obstruction')) {
      affected.push('door', 'entry_access');
    }
    
    return [...new Set([...affected, ...(incidentData.accessibilityFeatures || [])])];
  }

  evaluateMobilityImpact(incidentData) {
    const impacts = {
      high: ['elevator_outage', 'pathway_blocked_main'],
      medium: ['ramp_blocked', 'door_obstruction'],
      low: ['signage_damaged', 'button_broken']
    };
    
    for (const [level, types] of Object.entries(impacts)) {
      if (incidentData.incidentTypes?.some(type => types.includes(type))) {
        return level;
      }
    }
    
    return 'medium';
  }

  async findAlternativeRoutes(incidentData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const routes = [];
    
    if (incidentData.incidentTypes?.includes('elevator_outage')) {
      routes.push({
        type: 'stair_lift',
        availability: 'checking',
        estimatedSetup: '2 hours'
      });
    }
    
    if (incidentData.incidentTypes?.includes('ramp_blocked')) {
      routes.push({
        type: 'alternative_entrance',
        location: 'Entrada Norte',
        distance: '150m extra'
      });
    }
    
    return routes;
  }

  requiresImmediateAction(incidentData) {
    return incidentData.severity === 'high' || 
           incidentData.severity === 'critical' ||
           incidentData.incidentTypes?.includes('elevator_outage');
  }

  async assignAccessibilityResources(incidentContext) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    incidentContext.data.resourcesAssigned = {
      team: 'Equipo de Accesibilidad ESPOCH',
      contact: 'accessibility@espoch.edu.ec',
      responseTime: '30-60 minutes'
    };
    
    this.addLog(incidentContext, 'Recursos de accesibilidad asignados');
  }

  estimateFixTime(incidentData) {
    const fixTimes = {
      'elevator_outage': '2-4 hours (technical team)',
      'ramp_blocked': '1-2 hours (maintenance)',
      'door_obstruction': '30-60 minutes (facilities)',
      'pathway_blocked': '1-3 hours (cleaning crew)'
    };
    
    for (const [type, time] of Object.entries(fixTimes)) {
      if (incidentData.incidentTypes?.includes(type)) {
        return time;
      }
    }
    
    return '24-48 hours';
  }

  calculateAccessibilityPriority(incidentData) {
    const priorityMap = {
      critical: 100,
      high: 80,
      medium: 60,
      low: 40
    };
    
    const basePriority = priorityMap[incidentData.severity] || 50;
    
    // Incrementar prioridad si afecta movilidad
    if (this.evaluateMobilityImpact(incidentData) === 'high') {
      return basePriority + 20;
    }
    
    return basePriority;
  }
}

export default AccessibilityIncidentHandler;