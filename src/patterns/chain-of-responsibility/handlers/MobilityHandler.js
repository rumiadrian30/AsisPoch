import BaseHandler from './BaseHandler';

class MobilityHandler extends BaseHandler {
  canHandle(requestContext) {
    const { data } = requestContext;
    return data.assistanceType === 'mobility' ||
           (data.accessibilityNeeds && data.accessibilityNeeds.some(need => 
             ['wheelchair', 'elevator', 'ramp', 'physical'].includes(need)
           ));
  }

  async handle(requestContext) {
    if (!this.canHandle(requestContext)) {
      return await super.handle(requestContext);
    }

    console.log('♿ MobilityHandler: Procesando solicitud de movilidad');
    this.addLog(requestContext, 'Inicio procesamiento de movilidad');
    
    try {
      // 1. Verificar si necesita asistente
      const needsAssistant = this.needsMobilityAssistant(requestContext.data);
      
      if (needsAssistant) {
        await this.assignMobilityAssistant(requestContext);
      }
      
      // 2. Planificar ruta accesible si hay ubicación
      if (requestContext.data.location) {
        await this.planAccessibleRoute(requestContext);
      }
      
      // 3. Verificar recursos disponibles
      const resources = await this.checkResources(requestContext);
      requestContext.data.mobilityResources = resources;
      
      this.markProcessed(requestContext);
      this.addLog(requestContext, 'Movilidad procesada exitosamente');
      
    } catch (error) {
      this.addError(requestContext, `MobilityHandler error: ${error.message}`);
    }

    return await super.handle(requestContext);
  }

  needsMobilityAssistant(data) {
    return data.accessibilityNeeds?.includes('physical') || 
           data.assistanceType === 'mobility';
  }

  async assignMobilityAssistant(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    requestContext.data.assistant = {
      assigned: true,
      type: 'Mobility Assistant',
      estimatedArrival: '5-10 minutes',
      id: `AST-${Date.now()}`
    };
    
    this.addLog(requestContext, 'Asistente de movilidad asignado');
  }

  async planAccessibleRoute(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    requestContext.data.route = {
      planned: true,
      accessibilityScore: 95,
      estimatedTime: '15 minutes',
      hasElevator: true,
      hasRamp: requestContext.data.accessibilityNeeds?.includes('ramp') || false
    };
    
    this.addLog(requestContext, 'Ruta accesible planificada');
  }

  async checkResources(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      wheelchairsAvailable: 5,
      rampsAvailable: true,
      elevatorsOperational: true,
      lastChecked: new Date()
    };
  }
}

export default MobilityHandler;