/**
 * Contexto de la solicitud que viaja a través de la cadena
 */
class RequestContext {
  constructor(data) {
    this.data = data;
    this.history = [];
    this.status = 'pending';
    this.processedBy = [];
    this.errors = [];
    this.result = null;
    this.metadata = {
      startTime: new Date(),
      correlationId: data.correlationId || `CTX-${Date.now()}`
    };
  }

  setResult(result, status = 'completed') {
    this.result = result;
    this.status = status;
    this.metadata.endTime = new Date();
    this.metadata.duration = this.metadata.endTime - this.metadata.startTime;
  }

  toJSON() {
    return {
      data: this.data,
      history: this.history,
      status: this.status,
      processedBy: this.processedBy,
      errors: this.errors,
      result: this.result,
      metadata: this.metadata
    };
  }
}

export default RequestContext;