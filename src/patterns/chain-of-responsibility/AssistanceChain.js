import EmergencyHandler from './handlers/EmergencyHandler';
import MobilityHandler from './handlers/MobilityHandler';
import AcademicHandler from './handlers/AcademicHandler';
import WellbeingHandler from './handlers/WellbeingHandler';
import RequestContext from './RequestContext';

/**
 * Clase principal que configura y ejecuta la cadena de responsabilidad
 */
class AssistanceChain {
  constructor() {
    this.chain = this.buildChain();
  }

  buildChain() {
    // Construir la cadena en orden de prioridad
    const emergency = new EmergencyHandler();
    const mobility = new MobilityHandler();
    const academic = new AcademicHandler();
    const wellbeing = new WellbeingHandler();

    // Configurar la cadena: Emergency → Mobility → Academic → Wellbeing
    emergency.setNext(mobility).setNext(academic).setNext(wellbeing);
    
    return emergency;
  }

  async processRequest(requestData) {
    console.log('🔗 Iniciando cadena de procesamiento...');
    
    // Crear contexto de la solicitud
    const requestContext = new RequestContext(requestData);
    
    try {
      // Ejecutar la cadena
      const result = await this.chain.handle(requestContext);
      
      // Registrar resultado final
      requestContext.setResult({
        success: true,
        message: 'Solicitud procesada exitosamente',
        timestamp: new Date(),
        processedHandlers: requestContext.processedBy.map(p => p.handler)
      });
      
      console.log('✅ Cadena completada exitosamente');
      return requestContext;
      
    } catch (error) {
      console.error('❌ Error en la cadena:', error);
      
      requestContext.status = 'failed';
      requestContext.addError(`Error final: ${error.message}`);
      
      requestContext.setResult({
        success: false,
        error: error.message,
        timestamp: new Date()
      });
      
      return requestContext;
    }
  }

  // Método para obtener estadísticas de la cadena
  getChainInfo() {
    return {
      handlers: ['Emergency', 'Mobility', 'Academic', 'Wellbeing'],
      order: 'Emergency → Mobility → Academic → Wellbeing',
      description: 'Cadena de responsabilidad para procesamiento de solicitudes de asistencia'
    };
  }
}

export default AssistanceChain;