import BaseHandler from './BaseHandler';

class AcademicHandler extends BaseHandler {
  canHandle(requestContext) {
    const { data } = requestContext;
    return data.assistanceType === 'academic' ||
           (data.description && (
             data.description.toLowerCase().includes('clase') ||
             data.description.toLowerCase().includes('profesor') ||
             data.description.toLowerCase().includes('tarea') ||
             data.description.toLowerCase().includes('estudio')
           ));
  }

  async handle(requestContext) {
    if (!this.canHandle(requestContext)) {
      return await super.handle(requestContext);
    }

    console.log('📚 AcademicHandler: Procesando solicitud académica');
    this.addLog(requestContext, 'Inicio procesamiento académico');
    
    try {
      // 1. Determinar tipo de ayuda académica
      const helpType = this.determineAcademicHelpType(requestContext.data);
      
      // 2. Programar ayuda según tipo
      await this.scheduleAcademicHelp(requestContext, helpType);
      
      // 3. Proporcionar recursos si es necesario
      if (this.needsResources(requestContext.data)) {
        await this.provideResources(requestContext);
      }
      
      this.markProcessed(requestContext);
      this.addLog(requestContext, 'Solicitud académica procesada');
      
    } catch (error) {
      this.addError(requestContext, `AcademicHandler error: ${error.message}`);
    }

    return await super.handle(requestContext);
  }

  determineAcademicHelpType(data) {
    if (data.description?.toLowerCase().includes('tutor')) return 'tutoring';
    if (data.description?.toLowerCase().includes('material')) return 'materials';
    if (data.description?.toLowerCase().includes('clase')) return 'class_assistance';
    return 'general_academic';
  }

  async scheduleAcademicHelp(requestContext, helpType) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const schedules = {
      tutoring: { duration: '1 hora', frequency: 'semanal' },
      materials: { delivery: '24 horas', format: 'digital' },
      class_assistance: { type: 'in-class', support: 'notetaker' },
      general_academic: { consultation: '30 minutos' }
    };
    
    requestContext.data.academicSupport = {
      type: helpType,
      schedule: schedules[helpType],
      assignedTo: 'Departamento Académico',
      contact: 'academico@espoch.edu.ec'
    };
    
    this.addLog(requestContext, `Ayuda académica programada: ${helpType}`);
  }

  needsResources(data) {
    return data.description?.toLowerCase().includes('material') ||
           data.specialRequirements?.toLowerCase().includes('recurso');
  }

  async provideResources(requestContext) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    requestContext.data.resources = [
      'Guías de estudio',
      'Material complementario',
      'Acceso a plataforma virtual',
      'Bibliografía recomendada'
    ];
    
    this.addLog(requestContext, 'Recursos académicos proporcionados');
  }
}

export default AcademicHandler;