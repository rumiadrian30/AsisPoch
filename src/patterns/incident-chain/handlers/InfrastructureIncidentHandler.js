import BaseHandler from '../BaseHandler';

class InfrastructureIncidentHandler extends BaseHandler {
  canHandle(incidentContext) {
    const { data } = incidentContext;
    return data.incidentTypes?.some(type => 
      ['structural_damage', 'electrical', 'plumbing', 'heating_cooling'].includes(type)
    );
  }

  async handle(incidentContext) {
    if (!this.canHandle(incidentContext)) {
      return await super.handle(incidentContext);
    }

    console.log('🏗️ InfrastructureIncidentHandler: Procesando incidente de infraestructura');
    this.addLog(incidentContext, 'Inicio procesamiento de infraestructura');
    
    try {
      // 1. Evaluar riesgo estructural
      const structuralRisk = this.evaluateStructuralRisk(incidentContext.data);
      
      // 2. Determinar departamento responsable
      const responsibleDept = this.determineResponsibleDepartment(incidentContext.data);
      
      // 3. Estimar tiempo de reparación
      const repairEstimate = await this.estimateRepairTime(incidentContext.data);
      
      // 4. Si es crítico, evacuar área
      if (structuralRisk === 'high') {
        await this.initiateAreaEvacuation(incidentContext);
      }
      
      // 5. Registrar información técnica
      incidentContext.data.infrastructureAnalysis = {
        structuralRisk,
        responsibleDepartment: responsibleDept,
        repairEstimate,
        requiresSpecializedEquipment: this.requiresSpecialEquipment(incidentContext.data),
        safetyZone: this.defineSafetyZone(incidentContext.data)
      };
      
      this.markProcessed(incidentContext);
      this.addLog(incidentContext, 'Incidente de infraestructura procesado');
      
    } catch (error) {
      this.addError(incidentContext, `InfrastructureIncidentHandler error: ${error.message}`);
    }

    return await super.handle(incidentContext);
  }

  evaluateStructuralRisk(incidentData) {
    if (incidentData.incidentTypes?.includes('structural_damage')) {
      if (incidentData.severity === 'critical') return 'high';
      if (incidentData.description?.toLowerCase().includes('colapso') || 
          incidentData.description?.toLowerCase().includes('grieta grande')) {
        return 'high';
      }
    }
    
    if (incidentData.incidentTypes?.includes('electrical') && 
        incidentData.description?.toLowerCase().includes('chispa') ||
        incidentData.description?.toLowerCase().includes('fuego')) {
      return 'high';
    }
    
    return 'medium';
  }

  determineResponsibleDepartment(incidentData) {
    const departmentMap = {
      'structural_damage': 'Facilities & Engineering',
      'electrical': 'Electrical Maintenance',
      'plumbing': 'Plumbing Services',
      'heating_cooling': 'HVAC Department',
      'elevator_outage': 'Elevator Maintenance',
      'door_obstruction': 'Building Maintenance'
    };
    
    for (const [type, dept] of Object.entries(departmentMap)) {
      if (incidentData.incidentTypes?.includes(type)) {
        return dept;
      }
    }
    
    return 'General Maintenance';
  }

  async estimateRepairTime(incidentData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const repairTimes = {
      'structural_damage': { min: 24, max: 72, unit: 'hours' },
      'electrical': { min: 4, max: 12, unit: 'hours' },
      'plumbing': { min: 2, max: 8, unit: 'hours' },
      'heating_cooling': { min: 6, max: 24, unit: 'hours' },
      'elevator_outage': { min: 2, max: 6, unit: 'hours' }
    };
    
    for (const [type, time] of Object.entries(repairTimes)) {
      if (incidentData.incidentTypes?.includes(type)) {
        return `${time.min}-${time.max} ${time.unit}`;
      }
    }
    
    return '24-48 hours';
  }

  async initiateAreaEvacuation(incidentContext) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    incidentContext.data.evacuation = {
      required: true,
      zone: incidentContext.data.location?.building || 'Área afectada',
      status: 'pending',
      evacuationTeam: 'Security & Safety'
    };
    
    this.addLog(incidentContext, 'Evacuación de área iniciada');
  }

  requiresSpecialEquipment(incidentData) {
    const specialEquipmentTypes = [
      'structural_damage',
      'electrical',
      'elevator_outage'
    ];
    
    return incidentData.incidentTypes?.some(type => 
      specialEquipmentTypes.includes(type)
    );
  }

  defineSafetyZone(incidentData) {
    const radius = incidentData.severity === 'critical' ? '50m' : '25m';
    return {
      radius,
      perimeter: 'Cinta de seguridad requerida',
      access: 'Restringido a personal autorizado'
    };
  }
}

export default InfrastructureIncidentHandler;