/**
 * Handler base abstracto para la cadena de responsabilidad
 */
class BaseHandler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler; // Permite encadenamiento fluido
  }

  async handle(requestContext) {
    if (this.nextHandler) {
      return await this.nextHandler.handle(requestContext);
    }
    return requestContext; // Fin de la cadena
  }

  canHandle(requestContext) {
    // Método que debe ser implementado por los handlers específicos
    return false;
  }

  addLog(requestContext, action) {
    requestContext.history.push({
      handler: this.constructor.name,
      action,
      timestamp: new Date(),
      status: requestContext.status
    });
  }

  markProcessed(requestContext) {
    requestContext.processedBy.push({
      handler: this.constructor.name,
      timestamp: new Date()
    });
  }

  addError(requestContext, error) {
    requestContext.errors.push({
      error,
      timestamp: new Date(),
      handler: this.constructor.name
    });
  }
}

export default BaseHandler;