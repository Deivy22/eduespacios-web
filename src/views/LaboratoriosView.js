/**
 * Vista Principal: "Reserva de Laboratorios"
 * Selector de laboratorio, calendario semanal interactivo, franjas por turno,
 * matriz de estaciones con disponibilidad por fecha y panel resumen con validación.
 */
import { SEMANAS_CALENDARIO, TURNOS_LAB } from '../data/mockData.js';
import {
  obtenerHorariosTurno,
  estaFranjaOcupada,
  esFranjaReservadaPorUsuario
} from '../services/laboratoriosService.js';
import { escapeHtml, renderStatusBadge } from '../components/StatusBadge.js';
import { renderEmptyState } from '../components/Card.js';
import { openLabConfirmationModal } from '../components/Modal.js';
import { showToast } from '../components/Toast.js';

export function renderLaboratoriosView(state, store) {
  const { laboratorios, labBooking } = state;
  const currentLab = store.getCurrentLab();
  const currentWeek = SEMANAS_CALENDARIO[labBooking.weekIndex] || SEMANAS_CALENDARIO[0];
  const currentDay = store.getCurrentDay();
  const horariosTurno = obtenerHorariosTurno(labBooking.shift);
  const currentStationObj = currentLab.estaciones.find((e) => e.id === labBooking.stationId);

  // 1. Carrusel de laboratorios
  const labPillsHtml = laboratorios
    .map((lab) => {
      const active = lab.id === currentLab.id;
      return `
        <button
          type="button"
          data-lab-id="${escapeHtml(lab.id)}"
          aria-pressed="${active ? 'true' : 'false'}"
          class="snap-start whitespace-nowrap px-3.5 py-2.5 rounded-xl font-label-md flex items-center gap-1.5 transition-all cursor-pointer ${
            active
              ? 'bg-ink text-white shadow-sm'
              : 'bg-surface-container text-ink hover:bg-surface-container-high'
          }"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">${escapeHtml(lab.icono)}</span>
          <span>${escapeHtml(lab.nombre)}</span>
        </button>
      `;
    })
    .join('');

  // 2. Tira de días de la semana
  const daysHtml = currentWeek.dias
    .map((dia) => {
      const selected = dia.id === currentDay.id;
      const dotColor = selected
        ? 'bg-pastel-menta-dot'
        : dia.indicador === 'secondary'
          ? 'bg-secondary'
          : dia.indicador === 'menta'
            ? 'bg-pastel-menta-dot'
            : 'bg-outline-variant';

      return `
        <button
          type="button"
          data-day-id="${escapeHtml(dia.id)}"
          ${selected ? 'aria-current="date"' : ''}
          class="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all cursor-pointer ${
            selected
              ? 'bg-ink text-white shadow-sm'
              : 'bg-surface-container-low text-ink-muted hover:bg-surface-container hover:text-ink'
          }"
        >
          <span class="font-label-sm uppercase ${selected ? 'opacity-85' : 'opacity-75'}">${escapeHtml(dia.corto)}</span>
          <span class="font-headline-sm text-headline-sm leading-tight tabular-nums">${escapeHtml(dia.numero)}</span>
          <span class="w-1.5 h-1.5 rounded-full ${dotColor} mt-1"></span>
        </button>
      `;
    })
    .join('');

  // 3. Selector de turnos (Mañana / Tarde / Noche)
  const shiftsHtml = TURNOS_LAB.map((turno) => {
    const active = turno.id === labBooking.shift;
    return `
      <button
        type="button"
        data-shift-id="${escapeHtml(turno.id)}"
        aria-pressed="${active ? 'true' : 'false'}"
        class="flex-1 py-2 text-center font-label-md rounded-lg transition-all cursor-pointer ${
          active
            ? 'bg-white text-ink shadow-xs font-bold'
            : 'text-ink-muted hover:text-ink'
        }"
      >
        ${escapeHtml(turno.label)}
      </button>
    `;
  }).join('');

  // 4. Matriz de estaciones y horarios (con filtro opcional "Solo con cupo libre")
  const estacionesFiltradas = labBooking.onlyAvailable
    ? currentLab.estaciones.filter((est) =>
        horariosTurno.some((h) => !estaFranjaOcupada(est, labBooking.shift, h.corta, currentDay.id))
      )
    : currentLab.estaciones;

  const stationsHtml = estacionesFiltradas.length
    ? estacionesFiltradas
        .map((est) => {
          const hasSelected = labBooking.stationId === est.id;

          const slotsHtml = horariosTurno
            .map((h) => {
              const esPropia = esFranjaReservadaPorUsuario(est, labBooking.shift, h.corta, currentDay.id);
              const isOccupied = estaFranjaOcupada(est, labBooking.shift, h.corta, currentDay.id);
              const isSelected = !isOccupied && hasSelected && labBooking.slotCorta === h.corta;

              if (esPropia) {
                return `
                  <button
                    type="button"
                    disabled
                    title="Reservado por ti en esta fecha"
                    class="h-11 rounded-xl bg-pastel-lila border border-pastel-lila-border text-pastel-lila-ink font-label-sm flex flex-col items-center justify-center cursor-not-allowed tabular-nums"
                  >
                    <span>${escapeHtml(h.corta)}</span>
                    <span class="text-[9px] uppercase font-bold">Tu reserva</span>
                  </button>
                `;
              }

              if (isOccupied) {
                return `
                  <button
                    type="button"
                    disabled
                    title="Horario ocupado"
                    class="h-11 rounded-xl bg-surface-container-high text-outline font-label-sm flex flex-col items-center justify-center cursor-not-allowed opacity-75 tabular-nums"
                  >
                    <span class="line-through">${escapeHtml(h.corta)}</span>
                    <span class="text-[10px] uppercase font-semibold">Ocupado</span>
                  </button>
                `;
              }

              if (isSelected) {
                return `
                  <button
                    type="button"
                    data-slot-station="${escapeHtml(est.id)}"
                    data-slot-corta="${escapeHtml(h.corta)}"
                    data-slot-rango="${escapeHtml(h.rango)}"
                    aria-pressed="true"
                    class="h-11 rounded-xl bg-ink text-white font-label-sm flex flex-col items-center justify-center shadow-sm ring-2 ring-secondary transition-all active:scale-95 tabular-nums cursor-pointer"
                  >
                    <span class="flex items-center gap-0.5">
                      ${escapeHtml(h.corta)}
                      <span class="material-symbols-outlined text-[12px]" aria-hidden="true">check</span>
                    </span>
                    <span class="text-[10px] uppercase font-bold text-pastel-menta">Elegido</span>
                  </button>
                `;
              }

              return `
                <button
                  type="button"
                  data-slot-station="${escapeHtml(est.id)}"
                  data-slot-corta="${escapeHtml(h.corta)}"
                  data-slot-rango="${escapeHtml(h.rango)}"
                  aria-pressed="false"
                  class="h-11 rounded-xl bg-pastel-menta border border-pastel-menta-border/70 text-pastel-menta-ink hover:bg-[#bbf0da] font-label-sm flex flex-col items-center justify-center transition-all shadow-xs active:scale-95 tabular-nums cursor-pointer"
                >
                  <span>${escapeHtml(h.corta)}</span>
                  <span class="text-[10px] font-bold">Libre</span>
                </button>
              `;
            })
            .join('');

          return `
            <div class="flex flex-col gap-2 bg-surface-container-low p-3 rounded-xl transition-all ${
              hasSelected ? 'ring-2 ring-ink/15 bg-white shadow-xs' : ''
            }">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="material-symbols-outlined text-[17px] ${hasSelected ? 'text-secondary' : 'text-ink-muted'}" aria-hidden="true">
                    ${escapeHtml(currentLab.iconoPuesto)}
                  </span>
                  <span class="font-label-lg text-ink truncate">${escapeHtml(est.nombre)}</span>
                </div>
                <span class="font-label-sm text-ink-muted text-right truncate">${escapeHtml(est.specs)}</span>
              </div>
              <div class="grid grid-cols-4 gap-1.5">
                ${slotsHtml}
              </div>
            </div>
          `;
        })
        .join('')
    : renderEmptyState({
        icon: 'event_busy',
        title: 'Sin estaciones libres en este turno',
        description: 'Prueba cambiando de franja (Mañana, Tarde o Noche) o seleccionando otro día de la semana.'
      });

  // 5. Equipamiento adicional
  const equipHtml = currentLab.equipamientoExtra
    .map((eq) => {
      const checked = labBooking.equipamientoSeleccionado.includes(eq.id);
      const badgeClass =
        eq.badgeTipo === 'menta'
          ? 'bg-pastel-menta text-pastel-menta-ink'
          : 'bg-surface-container-high text-ink-muted';

      return `
        <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
          <input
            type="checkbox"
            data-equip-id="${escapeHtml(eq.id)}"
            ${checked ? 'checked' : ''}
            class="w-4 h-4 rounded accent-primary cursor-pointer"
          />
          <div class="flex items-center justify-between gap-2 w-full min-w-0">
            <span class="font-body-sm text-ink font-medium truncate">${escapeHtml(eq.nombre)}</span>
            <span class="shrink-0 font-label-sm uppercase text-[10px] px-1.5 py-0.5 rounded ${badgeClass}">
              ${escapeHtml(eq.badge)}
            </span>
          </div>
        </label>
      `;
    })
    .join('');

  const hasValidSlot = Boolean(currentStationObj && labBooking.slotCorta);

  return `
    <div class="flex flex-col w-full gap-space-md animate-view-in">
      <!-- Contexto del módulo -->
      <section class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5 text-ink-muted font-label-sm uppercase tracking-wider">
          <span class="material-symbols-outlined text-[16px] text-pastel-menta-ink" aria-hidden="true">biotech</span>
          <span>Módulos de Experimentación • ${escapeHtml(currentLab.pabellon)}</span>
        </div>
        <h2 class="font-headline-md text-headline-md text-ink tracking-tight">Reserva de Laboratorios</h2>
        <p class="font-body-md text-ink-muted">
          Acceso a estaciones de trabajo de alto rendimiento, instrumental analítico y microscopía digital.
        </p>
      </section>

      <!-- Carrusel de laboratorios -->
      <section class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-label-md text-ink-muted uppercase tracking-wider">Espacio de investigación</span>
          <span class="font-label-sm text-secondary flex items-center gap-1">
            <span class="material-symbols-outlined text-[15px]" aria-hidden="true">tune</span>
            ${laboratorios.length} disponibles
          </span>
        </div>
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          ${labPillsHtml}
        </div>
      </section>

      <!-- Cuadrícula principal -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        <!-- Columna izquierda: Calendario, Turnos y Matriz -->
        <div class="lg:col-span-7 flex flex-col gap-space-md">
          <!-- Selector de Fecha Semanal -->
          <section class="flex flex-col gap-2.5 card-elevated p-4 rounded-2xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-secondary" aria-hidden="true">calendar_today</span>
                <span class="font-label-lg text-ink">${escapeHtml(currentWeek.mesLabel)}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  id="btn-prev-week"
                  ${labBooking.weekIndex === 0 ? 'disabled' : ''}
                  aria-label="Semana anterior"
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low text-ink-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  id="btn-next-week"
                  ${labBooking.weekIndex >= SEMANAS_CALENDARIO.length - 1 ? 'disabled' : ''}
                  aria-label="Semana siguiente"
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low text-ink-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-5 gap-1.5 pt-0.5">
              ${daysHtml}
            </div>
          </section>

          <!-- Selector de Franjas y Leyenda -->
          <section class="flex flex-col gap-2">
            <div class="flex items-center justify-between bg-surface-container-low p-1 rounded-xl border border-ink/5">
              ${shiftsHtml}
            </div>

            <div class="flex items-center justify-between flex-wrap gap-2 px-1 text-ink-muted font-label-sm">
              <div class="flex items-center gap-3 flex-wrap">
                <div class="flex items-center gap-1.5">
                  <span class="w-3.5 h-3.5 rounded-full bg-pastel-menta border border-pastel-menta-border flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-pastel-menta-dot"></span>
                  </span>
                  <span>Libre</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3.5 h-3.5 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  </span>
                  <span>Ocupado</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3.5 h-3.5 rounded-full bg-ink flex items-center justify-center">
                    <span class="material-symbols-outlined text-[10px] text-white">check</span>
                  </span>
                  <span>Elegido</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-toggle-available-labs"
                aria-pressed="${labBooking.onlyAvailable ? 'true' : 'false'}"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-label-sm transition-colors cursor-pointer ${
                  labBooking.onlyAvailable
                    ? 'bg-pastel-menta border-pastel-menta-border text-pastel-menta-ink'
                    : 'bg-white border-ink/10 text-ink-muted hover:text-ink'
                }"
              >
                <span class="material-symbols-outlined text-[14px]" aria-hidden="true">filter_list</span>
                <span>Solo con cupo</span>
              </button>
            </div>
          </section>

          <!-- Matriz de Estaciones y Horarios -->
          <section class="flex flex-col gap-3 card-elevated p-4 rounded-2xl">
            <div class="flex items-center justify-between gap-2 pb-1">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="material-symbols-outlined text-[19px] text-pastel-menta-ink shrink-0" aria-hidden="true">grid_view</span>
                <h3 class="font-headline-sm text-headline-sm text-ink truncate">${escapeHtml(currentLab.tituloMatriz)}</h3>
              </div>
              <span class="shrink-0 font-label-sm text-ink-muted bg-surface-container px-2.5 py-0.5 rounded-full">
                ${estacionesFiltradas.length} ${estacionesFiltradas.length === 1 ? 'puesto' : 'puestos'}
              </span>
            </div>

            <div class="flex flex-col gap-2.5">
              ${stationsHtml}
            </div>
          </section>
        </div>

        <!-- Columna derecha: Panel Resumen y Confirmación -->
        <aside class="lg:col-span-5 lg:sticky lg:top-20 flex flex-col gap-3.5 card-elevated p-4 sm:p-5 rounded-2xl">
          <div class="flex items-center justify-between border-b border-surface-container pb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full bg-pastel-lila border border-pastel-lila-border/70 flex items-center justify-center text-pastel-lila-ink">
                <span class="material-symbols-outlined text-[19px]" aria-hidden="true">bookmark_added</span>
              </div>
              <div>
                <span class="font-label-sm text-secondary uppercase font-bold tracking-wider">Paso Final</span>
                <h3 class="font-headline-sm text-headline-sm text-ink leading-tight">Resumen de Reserva</h3>
              </div>
            </div>
            ${
              hasValidSlot
                ? renderStatusBadge('menta', 'Turno activo', { pulse: true })
                : renderStatusBadge('melocoton', 'Sin turno')
            }
          </div>

          <!-- Detalles dinámicos -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2 bg-surface-container-low px-3 py-2.5 rounded-xl">
              <div class="flex items-center gap-2 text-ink-muted font-body-sm shrink-0">
                <span class="material-symbols-outlined text-[18px] text-secondary">domain</span>
                <span>Laboratorio:</span>
              </div>
              <span class="font-label-md text-ink text-right truncate">
                ${escapeHtml(currentLab.nombre)}${currentStationObj ? ` • ${escapeHtml(currentStationObj.nombre)}` : ''}
              </span>
            </div>

            <div class="flex items-center justify-between gap-2 bg-surface-container-low px-3 py-2.5 rounded-xl">
              <div class="flex items-center gap-2 text-ink-muted font-body-sm shrink-0">
                <span class="material-symbols-outlined text-[18px] text-secondary">event</span>
                <span>Fecha:</span>
              </div>
              <span class="font-label-md text-ink text-right">${escapeHtml(currentDay.completo)}</span>
            </div>

            <div class="flex items-center justify-between gap-2 bg-surface-container-low px-3 py-2.5 rounded-xl">
              <div class="flex items-center gap-2 text-ink-muted font-body-sm shrink-0">
                <span class="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                <span>Horario:</span>
              </div>
              <span class="font-label-md font-bold text-pastel-menta-ink tabular-nums">
                ${escapeHtml(labBooking.slotRango)}
              </span>
            </div>
          </div>

          <!-- Motivo académico -->
          <div class="flex flex-col gap-1.5">
            <label for="lab-practice-reason" class="font-label-md text-ink flex items-center justify-between">
              <span>Motivo de práctica <span class="text-error">*</span></span>
              <span class="font-label-sm text-ink-muted">Obligatorio</span>
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-ink-muted pointer-events-none" aria-hidden="true">edit_note</span>
              <input
                id="lab-practice-reason"
                type="text"
                required
                value="${escapeHtml(labBooking.motivo)}"
                placeholder="Ej. Práctica final de Compiladores o Investigación"
                class="w-full h-11 pl-10 pr-3 rounded-xl bg-surface-container-low border border-ink/10 text-ink font-body-md placeholder:text-outline focus:bg-white focus:ring-2 focus:ring-ink/20 transition-all"
              />
            </div>
            <span id="lab-reason-error" class="hidden font-label-sm text-error"></span>
          </div>

          <!-- Equipamiento complementario -->
          <div class="flex flex-col gap-2">
            <span class="font-label-md text-ink">Equipamiento adicional requerido (sin costo):</span>
            <div class="flex flex-col gap-1.5">
              ${equipHtml}
            </div>
          </div>

          <!-- Política de acceso -->
          <div class="flex items-start gap-2.5 bg-pastel-melocoton border border-pastel-melocoton-border p-3 rounded-xl text-pastel-melocoton-ink text-body-sm">
            <span class="material-symbols-outlined text-[18px] shrink-0 mt-0.5" aria-hidden="true">info</span>
            <p class="leading-snug">${escapeHtml(currentLab.normativa)}</p>
          </div>

          <!-- Botón de confirmación -->
          <button
            type="button"
            id="btn-confirm-lab-booking"
            ${!hasValidSlot ? 'disabled' : ''}
            class="w-full h-12 rounded-xl font-label-lg flex items-center justify-center gap-2 transition-all ${
              hasValidSlot
                ? 'bg-ink text-white shadow-soft hover:bg-ink-body active:scale-[0.98] cursor-pointer'
                : 'bg-surface-container text-ink-muted cursor-not-allowed'
            }"
          >
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">check_circle</span>
            <span>Confirmar Reserva</span>
          </button>
        </aside>
      </div>
    </div>
  `;
}

export function bindLaboratoriosEvents(container, { store, navigate }) {
  // Seleccionar laboratorio
  container.querySelectorAll('[data-lab-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.selectLab(btn.getAttribute('data-lab-id'));
    });
  });

  // Cambiar semana
  container.querySelector('#btn-prev-week')?.addEventListener('click', () => store.changeLabWeek(-1));
  container.querySelector('#btn-next-week')?.addEventListener('click', () => store.changeLabWeek(1));

  // Seleccionar día
  container.querySelectorAll('[data-day-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.selectLabDay(btn.getAttribute('data-day-id'));
    });
  });

  // Seleccionar turno
  container.querySelectorAll('[data-shift-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.selectLabShift(btn.getAttribute('data-shift-id'));
    });
  });

  // Filtro "Solo con cupo"
  container.querySelector('#btn-toggle-available-labs')?.addEventListener('click', () => {
    store.toggleLabOnlyAvailable();
  });

  // Seleccionar celda libre en matriz
  container.querySelectorAll('[data-slot-station]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const stationId = btn.getAttribute('data-slot-station');
      const slotCorta = btn.getAttribute('data-slot-corta');
      const slotRango = btn.getAttribute('data-slot-rango');
      store.selectLabSlot(stationId, slotCorta, slotRango);
    });
  });

  // Sincronizar motivo en memoria y limpiar error inline al escribir
  const reasonInput = container.querySelector('#lab-practice-reason');
  const reasonError = container.querySelector('#lab-reason-error');
  reasonInput?.addEventListener('input', (e) => {
    store.updateLabMotivo(e.target.value);
    if (reasonError) reasonError.classList.add('hidden');
  });

  // Equipamiento complementario
  container.querySelectorAll('[data-equip-id]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      store.toggleLabEquipment(checkbox.getAttribute('data-equip-id'));
    });
  });

  // Confirmar reserva (reglas y conflictos validados en laboratoriosService)
  container.querySelector('#btn-confirm-lab-booking')?.addEventListener('click', () => {
    const motivo = reasonInput?.value || '';
    const resultado = store.reservarLaboratorio(motivo);

    if (!resultado.ok) {
      if (resultado.field === 'motivo' && reasonInput) {
        reasonInput.focus();
        reasonInput.classList.add('ring-2', 'ring-error');
        if (reasonError) {
          reasonError.textContent = resultado.error;
          reasonError.classList.remove('hidden');
        }
        setTimeout(() => reasonInput.classList.remove('ring-2', 'ring-error'), 1800);
      }
      showToast(resultado.error || 'No se pudo completar la reserva', {
        icon: 'warning',
        tone: 'warning'
      });
      return;
    }

    showToast('Estación reservada con éxito', {
      subtitle: `Ticket ${resultado.data.reserva.codigo} registrado en Mis Reservas.`,
      icon: 'biotech',
      tone: 'success'
    });
    openLabConfirmationModal(resultado.data, () => navigate('mis-reservas'));
  });
}
