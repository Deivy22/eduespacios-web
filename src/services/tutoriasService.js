/**
 * Servicio de Dominio: Tutorías Académicas
 * Aísla la lógica de negocio de filtrado, disponibilidad de franjas,
 * validación de solicitudes, detección de conflictos y creación de reservas.
 */

const MIN_TEMA_LENGTH = 5;

/**
 * Filtra el catálogo de tutorías según búsqueda textual, asignatura, turno y docente.
 */
export function filtrarTutorias(tutorias, filtros = {}) {
  const {
    search = '',
    subject = 'all',
    shift = 'todos',
    teacher = 'todos'
  } = filtros;

  const query = search.toLowerCase().trim();

  return tutorias.filter((tutoria) => {
    const matchSubject = subject === 'all' || tutoria.subjectKey === subject;
    const matchShift = shift === 'todos' || tutoria.turno === shift;
    const matchTeacher = teacher === 'todos' || tutoria.docenteKey === teacher;

    const textoIndexado = `${tutoria.asignatura} ${tutoria.docente} ${tutoria.especialidad} ${tutoria.modalidadTexto}`.toLowerCase();
    const matchSearch = !query || textoIndexado.includes(query);

    return matchSubject && matchShift && matchTeacher && matchSearch;
  });
}

/**
 * Indica si una franja de 30 min ya fue reservada por el estudiante en esta tutoría.
 */
export function estaFranjaTutoriaReservada(tutoria, franja) {
  if (!tutoria || !franja) return false;
  return Array.isArray(tutoria.franjasReservadas) && tutoria.franjasReservadas.includes(franja);
}

/**
 * Devuelve la primera franja disponible (no reservada) de una tutoría.
 */
export function obtenerPrimeraFranjaLibreTutoria(tutoria) {
  if (!tutoria || !Array.isArray(tutoria.franjas)) return null;
  return tutoria.franjas.find((f) => !estaFranjaTutoriaReservada(tutoria, f)) || null;
}

/**
 * Comprueba si ya existe una reserva activa en el mismo día y hora de inicio.
 */
export function detectarConflictoHorarioTutoria(reservasExistentes, diaBase, franja) {
  const horaInicio = franja.split('-')[0].trim();

  return (
    reservasExistentes.find((reserva) => {
      if (reserva.estado === 'cancelada') return false;
      const mismoDia = reserva.horario.toLowerCase().includes(diaBase.toLowerCase());
      const mismaHora = reserva.horaInicio === horaInicio;
      return mismoDia && mismaHora;
    }) || null
  );
}

/**
 * Valida las reglas de negocio antes de confirmar una solicitud de tutoría.
 * @returns {{ ok: boolean, error?: string, field?: string }}
 */
export function validarSolicitudTutoria({ tutoria, franja, tema, reservasExistentes = [] }) {
  if (!tutoria) {
    return { ok: false, error: 'La tutoría seleccionada no está disponible.' };
  }

  if (tutoria.cupos <= 0) {
    return { ok: false, error: 'Esta tutoría ya no cuenta con cupos disponibles.' };
  }

  if (!franja || !tutoria.franjas.includes(franja)) {
    return { ok: false, error: 'Selecciona una franja horaria válida de 30 minutos.' };
  }

  if (estaFranjaTutoriaReservada(tutoria, franja)) {
    return { ok: false, error: `Ya reservaste la franja ${franja} en esta tutoría. Elige otro horario.` };
  }

  const temaLimpio = (tema || '').trim();
  if (!temaLimpio) {
    return {
      ok: false,
      field: 'tema',
      error: 'Por favor, describe brevemente el tema de tu consulta.'
    };
  }

  if (temaLimpio.length < MIN_TEMA_LENGTH) {
    return {
      ok: false,
      field: 'tema',
      error: `Describe tu consulta con al menos ${MIN_TEMA_LENGTH} caracteres para orientar al docente.`
    };
  }

  const diaBase = tutoria.horarioCompleto.split('•')[0].trim();
  const conflicto = detectarConflictoHorarioTutoria(reservasExistentes, diaBase, franja);
  if (conflicto) {
    return {
      ok: false,
      error: `Conflicto de horario: ya tienes "${conflicto.titulo}" (${conflicto.codigo}) en esa franja.`
    };
  }

  return { ok: true };
}

/**
 * Construye una reserva de tutoría y su notificación asociada a partir de datos validados.
 */
export function crearReservaTutoria({ tutoria, franja, tema, recordatorio }) {
  const randomNum = Math.floor(1000 + Math.random() * 8999);
  const id = `TUT-${randomNum}`;
  const diaBase = tutoria.horarioCompleto.split('•')[0].trim();
  const temaLimpio = tema.trim();
  const esVirtual = tutoria.modalidadIcono === 'videocam';

  const reserva = {
    id,
    codigo: `#${id}`,
    categoria: 'tutoria',
    etiquetaCategoria: 'Tutoría Solicitada',
    titulo: tutoria.asignatura,
    subtitulo: `${tutoria.docente} • ${tutoria.ubicacionDetalle}`,
    ubicacionCorta: tutoria.ubicacionDetalle,
    horario: `${diaBase}, ${franja}`,
    horaInicio: franja.split('-')[0].trim(),
    icono: 'school',
    iconoHorario: esVirtual ? 'videocam' : 'event',
    tema: 'lila',
    estado: 'confirmada',
    accionPrincipalLabel: 'Ver detalle',
    accionPrincipalIcono: 'badge',
    accionInicioLabel: esVirtual ? 'Enlace' : 'Ver sala',
    accionInicioIcono: esVirtual ? 'link' : 'meeting_room',
    condiciones: recordatorio
      ? 'Confirmación enviada por correo y sincronizada con tu calendario universitario.'
      : tutoria.recomendacion,
    detallesExtra: {
      docente: tutoria.docente,
      modalidad: tutoria.modalidadTexto,
      temaConsulta: temaLimpio
    },
    origen: {
      tipo: 'tutoria',
      tutoriaId: tutoria.id,
      franja
    },
    iniciales: tutoria.iniciales
  };

  const notificacion = {
    id: `notif-${Date.now()}`,
    titulo: 'Nueva tutoría confirmada',
    detalle: `${tutoria.asignatura} (${franja}) con ${tutoria.docente}.`,
    tiempo: 'Ahora mismo',
    tipo: 'lila',
    leida: false
  };

  return { reserva, notificacion };
}
