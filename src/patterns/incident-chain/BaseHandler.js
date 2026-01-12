/**
 * Handler base abstracto para la cadena de responsabilidad de incidentes
 */
class BaseHandler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  async handle(incidentContext) {
    if (this.nextHandler) {
      return await this.nextHandler.handle(incidentContext);
    }
    return incidentContext;
  }

  canHandle(incidentContext) {
    return false;
  }

  addLog(incidentContext, action) {
    incidentContext.history.push({
      handler: this.constructor.name,
      action,
      timestamp: new Date(),
      status: incidentContext.status
    });
  }

  markProcessed(incidentContext) {
    incidentContext.processedBy.push({
      handler: this.constructor.name,
      timestamp: new Date()
    });
  }

  addError(incidentContext, error) {
    incidentContext.errors.push({
      error,
      timestamp: new Date(),
      handler: this.constructor.name
    });
  }
}

export default BaseHandler;