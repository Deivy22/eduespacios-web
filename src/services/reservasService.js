/**
 * Servicio de Dominio: Gestión y Estadísticas de Reservas
 * Aísla las consultas derivadas, filtros por categoría, reglas de cancelación/retiro
 * y cálculo de indicadores KPI académicos.
 */

export function obtenerReservasActivas(reservas = []) {
  return reservas.filter((r) => r.estado !== 'cancelada');
}

export function filtrarReservasPorCategoria(reservas = [], categoria = 'todas') {
  if (categoria === 'todas') return reservas;
  return reservas.filter((r) => r.categoria === categoria);
}

export function puedeCancelarReserva(reserva) {
  return Boolean(reserva && reserva.estado !== 'cancelada');
}

export function puedeRetirarReserva(reserva) {
  return Boolean(reserva && reserva.estado === 'cancelada');
}

/**
 * Calcula los indicadores mostrados en Inicio, Navegación y Mis Reservas.
 */
export function calcularEstadisticasAcademicas({
  estudiante,
  reservas = [],
  tutorias = [],
  laboratorios = []
}) {
  const activas = obtenerReservasActivas(reservas);
  const labsActivos = activas.filter((r) => r.categoria === 'laboratorio').length;
  const tutsActivas = activas.filter((r) => r.categoria === 'tutoria').length;
  const cuposTutorias = tutorias.reduce((acc, t) => acc + Math.max(0, t.cupos), 0);
  const proximaCita = activas[0]?.horaInicio || '--:--';
  const unreadNotifs = (estudiante?.notificaciones || []).filter((n) => !n.leida).length;

  return {
    totalActivas: activas.length,
    labsActivos,
    tutsActivas,
    horasEstudio: (estudiante?.horasEstudioSemana || 0) + Math.max(0, activas.length - 4),
    proximaCita,
    cuposTutorias,
    labsConCupo: laboratorios.length,
    unreadNotifs
  };
}
