import type { Servicio } from "../types/Servicio";

export const servicios: Servicio[] = [
  // CONSULTAS
  { codigo: "CN001", categoria: "Consulta", nombre: "Primera consulta nutricional", duracion: "50 min", modalidad: "Presencial", precio: 35000, stock: 5, descripcion: "Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio." },
  { codigo: "CN002", categoria: "Consulta", nombre: "Control nutricional (seguimiento)", duracion: "30 min", modalidad: "Presencial", precio: 25000, stock: 5, descripcion: "Seguimiento mensual: medición de indicadores y ajuste del plan vigente." },
  { codigo: "CN003", categoria: "Consulta", nombre: "Control nutricional quincenal", duracion: "30 min", modalidad: "Presencial", precio: 22000, stock: 5, descripcion: "Seguimiento intensivo cada 15 días. Recomendado en los primeros 2 meses." },
  { codigo: "CN004", categoria: "Consulta", nombre: "Teleconsulta nutricional", duracion: "30 min", modalidad: "Online (video)", precio: 20000, stock: 5, descripcion: "Consulta de seguimiento vía videollamada. Requiere contar con consulta presencial previa." },
  { codigo: "CN005", categoria: "Consulta", nombre: "Consulta de urgencia / reagendada", duracion: "30 min", modalidad: "Presencial", precio: 28000, stock: 5, descripcion: "Para pacientes que requieren atención fuera de su control habitual." },
  // PLANES ESPECIALIZADOS
  { codigo: "PL001", categoria: "Plan especializado", nombre: "Plan pérdida de peso (1 mes)", duracion: "—", modalidad: "Presencial", precio: 65000, stock: 3, descripcion: "Incluye primera consulta + 1 control quincenal + plan alimenticio personalizado + seguimiento por WhatsApp." },
  { codigo: "PL002", categoria: "Plan especializado", nombre: "Plan pérdida de peso (3 meses)", duracion: "—", modalidad: "Presencial", precio: 170000, stock: 3, descripcion: "Incluye primera consulta + 5 controles + 3 planes mensuales + seguimiento continuo." },
  { codigo: "PL003", categoria: "Plan especializado", nombre: "Plan nutrición deportiva (1 mes)", duracion: "—", modalidad: "Presencial", precio: 70000, stock: 3, descripcion: "Para deportistas y personas con actividad física frecuente. Cálculo de requerimientos energéticos y proteicos." },
  { codigo: "PL004", categoria: "Plan especializado", nombre: "Plan control diabetes / hipertensión", duracion: "—", modalidad: "Presencial", precio: 75000, stock: 3, descripcion: "Plan adaptado para patologías metabólicas. Coordinación con médico tratante si aplica." },
  { codigo: "PL005", categoria: "Plan especializado", nombre: "Plan alimentación vegetariana/vegana", duracion: "—", modalidad: "Presencial", precio: 68000, stock: 3, descripcion: "Diseñado para garantizar aporte adecuado de proteínas, hierro, vitamina B12 y calcio sin productos animales." },
  { codigo: "PL006", categoria: "Plan especializado", nombre: "Plan alimentación infantil (2-12 años)", duracion: "—", modalidad: "Presencial", precio: 65000, stock: 3, descripcion: "Evaluación nutricional pediátrica y diseño de plan adaptado a la etapa de desarrollo del niño." },
  // EVALUACIONES
  { codigo: "EV001", categoria: "Evaluación", nombre: "Antropometría completa", duracion: "20 min", modalidad: "Presencial", precio: 18000, stock: 8, descripcion: "Peso, talla, IMC, circunferencia de cintura, cadera, brazo y % de grasa corporal con bioimpedanciometría." },
  { codigo: "EV002", categoria: "Evaluación", nombre: "Bioimpedanciometría", duracion: "15 min", modalidad: "Presencial", precio: 12000, stock: 8, descripcion: "Medición de composición corporal: masa grasa, masa muscular, agua corporal y edad metabólica." },
  { codigo: "EV003", categoria: "Evaluación", nombre: "Encuesta de hábitos alimentarios", duracion: "20 min", modalidad: "Presencial", precio: 10000, stock: 8, descripcion: "Análisis del patrón alimentario actual. Identificación de déficit y excesos nutricionales." },
  { codigo: "EV004", categoria: "Evaluación", nombre: "Análisis de exámenes de laboratorio", duracion: "20 min", modalidad: "Presencial", precio: 15000, stock: 8, descripcion: "Interpretación de hemograma, perfil bioquímico y lipídico en contexto nutricional." },
  // TALLERES GRUPALES
  { codigo: "TG001", categoria: "Taller grupal", nombre: "Taller de alimentación saludable", duracion: "90 min", modalidad: "Presencial (grupo)", precio: 15000, stock: 10, descripcion: "Máx. 10 personas. Conceptos básicos de alimentación equilibrada y lectura de etiquetas." },
  { codigo: "TG002", categoria: "Taller grupal", nombre: "Taller de cocina nutritiva", duracion: "120 min", modalidad: "Presencial (grupo)", precio: 20000, stock: 8, descripcion: "Preparación de recetas saludables. Incluye degustación. Máx. 8 personas." },
  { codigo: "TG003", categoria: "Taller grupal", nombre: "Taller nutrición para deportistas", duracion: "90 min", modalidad: "Presencial (grupo)", precio: 18000, stock: 12, descripcion: "Hidratación, nutrición pre y post entrenamiento, suplementación básica. Máx. 12 personas." },
];
