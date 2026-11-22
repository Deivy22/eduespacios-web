/**
 * Servicio de Dominio: Reserva de Laboratorios
 * Centraliza la consulta de disponibilidad horaria por fecha y turno,
 * detección de conflictos, validación de formularios y creación de vouchers.
 */
import { TURNOS_LAB } from '../data/mockData.js';

const MIN_MOTIVO_LENGTH = 5;

export function construirClaveFechaTurno(dayId, shift) {
  return `${dayId}__${shift}`;
}

/**
 * Obtiene los bloques horarios correspondientes a un turno (Mañana, Tarde, Noche).
 */
export function obtenerHorariosTurno(shift) {
  const turno = TURNOS_LAB.find((t) => t.id === shift) || TURNOS_LAB[1];
  return turno.horarios;
}

/**
 * Verifica si una franja específica está ocupada (base o reservada por el estudiante en esa fecha).
 */
export function estaFranjaOcupada(estacion, shift, slotCorta, dayId = null) {
  if (!estacion || !slotCorta) return true;
  const ocupadosBase = estacion.ocupados?.[shift] || [];
  if (ocupadosBase.includes(slotCorta)) return true;

  if (dayId && estacion.ocupadosPorFecha) {
    const clave = construirClaveFechaTurno(dayId, shift);
    const ocupadosFecha = estacion.ocupadosPorFecha[clave] || [];
    if (ocupadosFecha.includes(slotCorta)) return true;
  }

  return false;
}

/**
 * Indica si una franja fue reservada por el propio usuario en la fecha y turno dados.
 */
export function esFranjaReservadaPorUsuario(estacion, shift, slotCorta, dayId) {
  if (!estacion || !dayId || !estacion.ocupadosPorFecha) return false;
  const clave = construirClaveFechaTurno(dayId, shift);
  return (estacion.ocupadosPorFecha[clave] || []).includes(slotCorta);
}

/**
 * Localiza el primer puesto y horario libre disponible dentro de un laboratorio, fecha y turno.
 */
export function obtenerPrimerTurnoDisponible(lab, shift, dayId = null) {
  const horarios = obtenerHorariosTurno(shift);

  for (const estacion of lab.estaciones) {
    for (const horario of horarios) {
      if (!estaFranjaOcupada(estacion, shift, horario.corta, dayId)) {
        return {
          stationId: estacion.id,
          slotCorta: horario.corta,
          slotRango: horario.rango
        };
      }
    }
  }

  return {
    stationId: null,
    slotCorta: null,
    slotRango: 'Sin disponibilidad'
  };
}

/**
 * Detecta si el estudiante ya posee una reserva activa que se solapa en la misma fecha y hora.
 */
export function detectarConflictoHorarioLaboratorio(reservasExistentes, fechaCompleta, slotCorta) {
  return (
    reservasExistentes.find((reserva) => {
      if (reserva.estado === 'cancelada') return false;
      const mismaFecha = reserva.horario.toLowerCase().includes(fechaCompleta.toLowerCase());
      const mismaHora = reserva.horaInicio === slotCorta;
      return mismaFecha && mismaHora;
    }) || null
  );
}

/**
 * Valida todas las reglas de negocio previas a confirmar un turno de laboratorio.
 * @returns {{ ok: boolean, error?: string, field?: string }}
 */
export function validarReservaLaboratorio({
  lab,
  estacion,
  dia,
  shift,
  slotCorta,
  motivo,
  reservasExistentes = []
}) {
  if (!lab || !estacion || !slotCorta) {
    return { ok: false, error: 'Selecciona una estación y una franja horaria libre para continuar.' };
  }

  if (estaFranjaOcupada(estacion, shift, slotCorta, dia?.id)) {
    return {
      ok: false,
      error: `El horario ${slotCorta} en ${estacion.nombre} ya está ocupado. Elige otra celda libre.`
    };
  }

  const motivoLimpio = (motivo || '').trim();
  if (!motivoLimpio) {
    return {
      ok: false,
      field: 'motivo',
      error: 'Indica el motivo académico de la práctica antes de confirmar.'
    };
  }

  if (motivoLimpio.length < MIN_MOTIVO_LENGTH) {
    return {
      ok: false,
      field: 'motivo',
      error: `El motivo académico debe tener al menos ${MIN_MOTIVO_LENGTH} caracteres.`
    };
  }

  const conflicto = detectarConflictoHorarioLaboratorio(reservasExistentes, dia.completo, slotCorta);
  if (conflicto) {
    return {
      ok: false,
      error: `Conflicto horario: ya tienes "${conflicto.titulo}" (${conflicto.codigo}) para ${dia.completo} a las ${slotCorta}.`
    };
  }

  return { ok: true };
}

/**
 * Construye la reserva de laboratorio, su notificación y el resumen para el modal voucher.
 */
export function crearReservaLaboratorio({
  lab,
  estacion,
  dia,
  shift,
  slotCorta,
  slotRango,
  motivo,
  equipamientoSeleccionado = []
}) {
  const randomNum = Math.floor(1000 + Math.random() * 8999);
  const id = `LAB-${randomNum}`;
  const motivoLimpio = motivo.trim();

  const extrasNombres = lab.equipamientoExtra
    .filter((eq) => equipamientoSeleccionado.includes(eq.id))
    .map((eq) => eq.nombre);

  const reserva = {
    id,
    codigo: `#${id}`,
    categoria: 'laboratorio',
    etiquetaCategoria: 'Puesto Asignado',
    titulo: lab.nombre,
    subtitulo: `${estacion.nombre} • ${lab.pabellon}`,
    ubicacionCorta: `${estacion.nombre} • ${lab.pabellon}`,
    horario: `${dia.completo}, ${slotRango}`,
    horaInicio: slotCorta,
    icono: lab.icono,
    iconoHorario: 'schedule',
    tema: 'cielo',
    estado: 'confirmada',
    accionPrincipalLabel: 'Ver detalle y Pase',
    accionPrincipalIcono: 'qr_code_2',
    accionInicioLabel: 'Ficha',
    accionInicioIcono: 'info',
    condiciones: lab.normativa,
    detallesExtra: {
      estacion: `${estacion.nombre} (${estacion.specs})`,
      motivoPractica: motivoLimpio,
      equipamiento: extrasNombres.length ? extrasNombres.join(', ') : 'Equipamiento estándar de estación'
    },
    origen: {
      tipo: 'laboratorio',
      labId: lab.id,
      stationId: estacion.id,
      dayId: dia.id,
      shift,
      slotCorta
    },
    iniciales: null
  };

  const notificacion = {
    id: `notif-${Date.now()}`,
    titulo: 'Estación de laboratorio confirmada',
    detalle: `${lab.nombre} (${estacion.nombre}) para ${dia.completo} a las ${slotCorta}.`,
    tiempo: 'Ahora mismo',
    tipo: 'menta',
    leida: false
  };

  return {
    reserva,
    notificacion,
    resumenVoucher: {
      reserva,
      estacionNombre: estacion.nombre,
      fecha: dia.completo,
      horario: slotRango,
      labNombre: lab.nombre
    }
  };
}
