/**
 * Capa de Estado Centralizada (Patrón Pub/Sub + persistencia en localStorage).
 * Mantiene sincronizadas las 4 vistas y delega validaciones, conflictos y filtros a `src/services/`.
 */
import {
  ESTUDIANTE_ACTUAL,
  TUTORIAS_INICIALES,
  LABORATORIOS_INICIALES,
  SEMANAS_CALENDARIO,
  RESERVAS_INICIALES
} from '../data/mockData.js';

import {
  filtrarTutorias,
  obtenerPrimeraFranjaLibreTutoria,
  validarSolicitudTutoria,
  crearReservaTutoria
} from '../services/tutoriasService.js';

import {
  construirClaveFechaTurno,
  estaFranjaOcupada,
  obtenerPrimerTurnoDisponible,
  validarReservaLaboratorio,
  crearReservaLaboratorio
} from '../services/laboratoriosService.js';

import {
  obtenerReservasActivas,
  filtrarReservasPorCategoria,
  puedeCancelarReserva,
  puedeRetirarReserva,
  calcularEstadisticasAcademicas
} from '../services/reservasService.js';

const STORAGE_KEY = 'eduespacios_portal_state_v2';
const VALID_ROUTES = ['inicio', 'tutorias', 'laboratorios', 'mis-reservas'];

const clone = (obj) => JSON.parse(JSON.stringify(obj));

function buildInitialState() {
  const labInicial = LABORATORIOS_INICIALES[0];
  const tutorias = clone(TUTORIAS_INICIALES).map((t) => ({
    ...t,
    franjasReservadas: []
  }));

  const selectedTutoriaSlots = {};
  tutorias.forEach((t) => {
    selectedTutoriaSlots[t.id] = t.franjas[0] || null;
  });

  return {
    route: 'inicio',
    estudiante: clone(ESTUDIANTE_ACTUAL),
    tutorias,
    laboratorios: clone(LABORATORIOS_INICIALES),
    reservas: clone(RESERVAS_INICIALES),

    tutoriasFilters: {
      search: '',
      subject: 'all',
      shift: 'todos',
      teacher: 'todos'
    },
    selectedTutoriaSlots,

    labBooking: {
      labId: labInicial.id,
      weekIndex: 0,
      dayId: SEMANAS_CALENDARIO[0].dias[2].id,
      shift: 'Tarde',
      onlyAvailable: false,
      stationId: 'PC-02',
      slotCorta: '11:00',
      slotRango: '11:00 - 12:00 hrs',
      motivo: labInicial.motivoSugerido,
      equipamientoSeleccionado: labInicial.equipamientoExtra
        .filter((eq) => eq.checked)
        .map((eq) => eq.id)
    },

    reservasTab: 'todas'
  };
}

function loadPersistedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.reservas) || !Array.isArray(parsed.tutorias)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

class EduEspaciosStore {
  constructor() {
    const base = buildInitialState();
    const persisted = loadPersistedData();
    if (persisted) {
      const tutorias = persisted.tutorias.map((t) => ({
        ...t,
        franjasReservadas: Array.isArray(t.franjasReservadas) ? t.franjasReservadas : []
      }));
      const selectedTutoriaSlots = {};
      tutorias.forEach((t) => {
        selectedTutoriaSlots[t.id] = obtenerPrimeraFranjaLibreTutoria(t);
      });

      this.state = {
        ...base,
        tutorias,
        selectedTutoriaSlots,
        laboratorios: persisted.laboratorios || base.laboratorios,
        reservas: persisted.reservas,
        estudiante: {
          ...base.estudiante,
          notificaciones: persisted.notificaciones || base.estudiante.notificaciones
        }
      };

      // Asegurar que la selección inicial del lab sigue estando disponible tras restaurar localStorage
      const lab = this.getCurrentLab();
      const { shift, stationId, slotCorta, dayId } = this.state.labBooking;
      const est = lab.estaciones.find((e) => e.id === stationId);
      if (!est || estaFranjaOcupada(est, shift, slotCorta, dayId)) {
        const libre = obtenerPrimerTurnoDisponible(lab, shift, dayId);
        this.state.labBooking = { ...this.state.labBooking, ...libre };
      }
    } else {
      this.state = base;
    }

    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          tutorias: this.state.tutorias,
          laboratorios: this.state.laboratorios,
          reservas: this.state.reservas,
          notificaciones: this.state.estudiante.notificaciones
        })
      );
    } catch {
      // Ignorar errores de cuota o modo privado
    }
  }

  notify() {
    this.persist();
    this.listeners.forEach((fn) => fn(this.state));
  }

  // -------------------- Navegación --------------------
  setRoute(route) {
    const target = VALID_ROUTES.includes(route) ? route : 'inicio';
    if (this.state.route !== target) {
      this.state.route = target;
      this.notify();
    }
  }

  // -------------------- Tutorías --------------------
  setTutoriasFilter(partial) {
    this.state.tutoriasFilters = { ...this.state.tutoriasFilters, ...partial };
    this.notify();
  }

  resetTutoriasFilters() {
    this.state.tutoriasFilters = {
      search: '',
      subject: 'all',
      shift: 'todos',
      teacher: 'todos'
    };
    this.notify();
  }

  selectTutoriaSlot(tutoriaId, franja) {
    this.state.selectedTutoriaSlots = {
      ...this.state.selectedTutoriaSlots,
      [tutoriaId]: franja
    };
    this.notify();
  }

  getSelectedTutoriaSlot(tutoriaId) {
    const tutoria = this.state.tutorias.find((t) => t.id === tutoriaId);
    if (!tutoria) return null;
    const saved = this.state.selectedTutoriaSlots[tutoriaId];
    const reservadas = tutoria.franjasReservadas || [];
    if (saved && tutoria.franjas.includes(saved) && !reservadas.includes(saved)) {
      return saved;
    }
    return obtenerPrimeraFranjaLibreTutoria(tutoria);
  }

  reservarTutoria({ tutoriaId, franja, tema, recordatorio }) {
    const tutoria = this.state.tutorias.find((t) => t.id === tutoriaId);
    const validacion = validarSolicitudTutoria({
      tutoria,
      franja,
      tema,
      reservasExistentes: this.state.reservas
    });

    if (!validacion.ok) {
      return validacion;
    }

    tutoria.cupos = Math.max(0, tutoria.cupos - 1);
    if (!Array.isArray(tutoria.franjasReservadas)) tutoria.franjasReservadas = [];
    tutoria.franjasReservadas.push(franja);

    // Preseleccionar la siguiente franja libre de esta tutoría
    this.state.selectedTutoriaSlots[tutoriaId] = obtenerPrimeraFranjaLibreTutoria(tutoria);

    const { reserva, notificacion } = crearReservaTutoria({
      tutoria,
      franja,
      tema,
      recordatorio
    });

    this.state.reservas.unshift(reserva);
    this.state.estudiante.notificaciones.unshift(notificacion);
    this.notify();

    return { ok: true, data: reserva };
  }

  // -------------------- Laboratorios --------------------
  getCurrentLab() {
    return (
      this.state.laboratorios.find((l) => l.id === this.state.labBooking.labId) ||
      this.state.laboratorios[0]
    );
  }

  getCurrentDay() {
    const week = SEMANAS_CALENDARIO[this.state.labBooking.weekIndex] || SEMANAS_CALENDARIO[0];
    return week.dias.find((d) => d.id === this.state.labBooking.dayId) || week.dias[0];
  }

  selectLab(labId) {
    const lab = this.state.laboratorios.find((l) => l.id === labId);
    if (!lab) return;

    const turnoLibre = obtenerPrimerTurnoDisponible(
      lab,
      this.state.labBooking.shift,
      this.state.labBooking.dayId
    );
    this.state.labBooking = {
      ...this.state.labBooking,
      labId: lab.id,
      motivo: lab.motivoSugerido,
      equipamientoSeleccionado: lab.equipamientoExtra.filter((e) => e.checked).map((e) => e.id),
      ...turnoLibre
    };
    this.notify();
  }

  changeLabWeek(delta) {
    const nextIdx = Math.max(
      0,
      Math.min(SEMANAS_CALENDARIO.length - 1, this.state.labBooking.weekIndex + delta)
    );
    if (nextIdx === this.state.labBooking.weekIndex) return;
    const nextDayId = SEMANAS_CALENDARIO[nextIdx].dias[0].id;
    const lab = this.getCurrentLab();
    const libre = obtenerPrimerTurnoDisponible(lab, this.state.labBooking.shift, nextDayId);

    this.state.labBooking = {
      ...this.state.labBooking,
      weekIndex: nextIdx,
      dayId: nextDayId,
      ...libre
    };
    this.notify();
  }

  selectLabDay(dayId) {
    const lab = this.getCurrentLab();
    const { shift, stationId, slotCorta } = this.state.labBooking;
    const estacion = lab.estaciones.find((e) => e.id === stationId);

    this.state.labBooking.dayId = dayId;
    if (!estacion || estaFranjaOcupada(estacion, shift, slotCorta, dayId)) {
      const libre = obtenerPrimerTurnoDisponible(lab, shift, dayId);
      this.state.labBooking = { ...this.state.labBooking, ...libre };
    }
    this.notify();
  }

  selectLabShift(shift) {
    const lab = this.getCurrentLab();
    const turnoLibre = obtenerPrimerTurnoDisponible(lab, shift, this.state.labBooking.dayId);
    this.state.labBooking = {
      ...this.state.labBooking,
      shift,
      ...turnoLibre
    };
    this.notify();
  }

  toggleLabOnlyAvailable() {
    this.state.labBooking.onlyAvailable = !this.state.labBooking.onlyAvailable;
    this.notify();
  }

  selectLabSlot(stationId, slotCorta, slotRango) {
    this.state.labBooking.stationId = stationId;
    this.state.labBooking.slotCorta = slotCorta;
    this.state.labBooking.slotRango = slotRango;
    this.notify();
  }

  updateLabMotivo(motivo) {
    this.state.labBooking.motivo = motivo;
  }

  toggleLabEquipment(eqId) {
    const list = this.state.labBooking.equipamientoSeleccionado;
    const idx = list.indexOf(eqId);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(eqId);
    }
    this.notify();
  }

  reservarLaboratorio(motivoActual) {
    const lab = this.getCurrentLab();
    const dia = this.getCurrentDay();
    const { shift, stationId, slotCorta, slotRango, equipamientoSeleccionado } = this.state.labBooking;
    const estacion = lab.estaciones.find((e) => e.id === stationId);

    const validacion = validarReservaLaboratorio({
      lab,
      estacion,
      dia,
      shift,
      slotCorta,
      motivo: motivoActual,
      reservasExistentes: this.state.reservas
    });

    if (!validacion.ok) {
      return validacion;
    }

    // Registrar ocupación específica por fecha + turno
    if (!estacion.ocupadosPorFecha) estacion.ocupadosPorFecha = {};
    const claveFechaTurno = construirClaveFechaTurno(dia.id, shift);
    if (!estacion.ocupadosPorFecha[claveFechaTurno]) {
      estacion.ocupadosPorFecha[claveFechaTurno] = [];
    }
    estacion.ocupadosPorFecha[claveFechaTurno].push(slotCorta);

    const { reserva, notificacion, resumenVoucher } = crearReservaLaboratorio({
      lab,
      estacion,
      dia,
      shift,
      slotCorta,
      slotRango,
      motivo: motivoActual,
      equipamientoSeleccionado
    });

    this.state.reservas.unshift(reserva);
    this.state.estudiante.notificaciones.unshift(notificacion);

    const siguienteLibre = obtenerPrimerTurnoDisponible(lab, shift, dia.id);
    this.state.labBooking = { ...this.state.labBooking, ...siguienteLibre };
    this.notify();

    return { ok: true, data: resumenVoucher };
  }

  // -------------------- Mis Reservas --------------------
  setReservasTab(tab) {
    this.state.reservasTab = tab;
    this.notify();
  }

  cancelarReserva(reservaId) {
    const reserva = this.state.reservas.find((r) => r.id === reservaId);
    if (!puedeCancelarReserva(reserva)) return false;

    reserva.estado = 'cancelada';

    // Liberar cupo o celda en el recurso de origen si aplica
    if (reserva.origen?.tipo === 'tutoria') {
      const tut = this.state.tutorias.find((t) => t.id === reserva.origen.tutoriaId);
      if (tut) {
        tut.cupos += 1;
        tut.franjasReservadas = (tut.franjasReservadas || []).filter(
          (f) => f !== reserva.origen.franja
        );
        if (!this.state.selectedTutoriaSlots[tut.id]) {
          this.state.selectedTutoriaSlots[tut.id] = reserva.origen.franja;
        }
      }
    } else if (reserva.origen?.tipo === 'laboratorio') {
      const lab = this.state.laboratorios.find((l) => l.id === reserva.origen.labId);
      const est = lab?.estaciones.find((e) => e.id === reserva.origen.stationId);
      if (est?.ocupadosPorFecha) {
        const clave = construirClaveFechaTurno(reserva.origen.dayId, reserva.origen.shift);
        est.ocupadosPorFecha[clave] = (est.ocupadosPorFecha[clave] || []).filter(
          (s) => s !== reserva.origen.slotCorta
        );
      }
    }

    this.notify();
    return true;
  }

  retirarReservaCancelada(reservaId) {
    const reserva = this.state.reservas.find((r) => r.id === reservaId);
    if (!puedeRetirarReserva(reserva)) return false;
    this.state.reservas = this.state.reservas.filter((r) => r.id !== reservaId);
    this.notify();
    return true;
  }

  // -------------------- Notificaciones & Demo --------------------
  markNotificationsRead() {
    this.state.estudiante.notificaciones.forEach((n) => {
      n.leida = true;
    });
    this.notify();
  }

  resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    const currentRoute = this.state.route;
    this.state = buildInitialState();
    this.state.route = currentRoute;
    this.notify();
  }

  // -------------------- Selectores delegados a servicios --------------------
  getActiveReservations() {
    return obtenerReservasActivas(this.state.reservas);
  }

  getStats() {
    return calcularEstadisticasAcademicas(this.state);
  }

  getFilteredTutorias() {
    return filtrarTutorias(this.state.tutorias, this.state.tutoriasFilters);
  }

  getFilteredReservas() {
    return filtrarReservasPorCategoria(this.state.reservas, this.state.reservasTab);
  }
}

export const store = new EduEspaciosStore();
