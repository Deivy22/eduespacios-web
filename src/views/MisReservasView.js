/**
 * Vista Principal: "Mis Reservas"
 * Supervisión de tutorías y laboratorios reservados, pestañas por categoría,
 * pase digital QR y flujo de cancelación con confirmación.
 */
import { escapeHtml, renderStatusBadge } from '../components/StatusBadge.js';
import { renderReservationCard, renderEmptyState, renderTipBanner } from '../components/Card.js';

export function renderMisReservasView(state, store) {
  const { reservas, reservasTab } = state;
  const stats = store.getStats();
  const filtradas = store.getFilteredReservas();

  const totalTodas = reservas.length;
  const totalTuts = reservas.filter((r) => r.categoria === 'tutoria').length;
  const totalLabs = reservas.filter((r) => r.categoria === 'laboratorio').length;

  const tabs = [
    { id: 'todas', label: 'Todas', count: totalTodas },
    { id: 'tutoria', label: 'Tutorías', count: totalTuts },
    { id: 'laboratorio', label: 'Laboratorios', count: totalLabs }
  ];

  const tabsHtml = tabs
    .map((tab) => {
      const active = reservasTab === tab.id;
      return `
        <button
          type="button"
          data-reservas-tab="${tab.id}"
          class="flex-1 py-2 px-3 rounded-xl font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            active
              ? 'bg-white text-ink shadow-xs font-bold'
              : 'text-ink-muted hover:text-ink'
          }"
        >
          <span>${tab.label}</span>
          <span class="text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
            active
              ? 'bg-surface-container-high text-ink'
              : 'bg-surface-container text-ink-muted'
          }">
            ${tab.count}
          </span>
        </button>
      `;
    })
    .join('');

  const listHtml = filtradas.length
    ? `<div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
         ${filtradas.map((r) => renderReservationCard(r)).join('')}
       </div>`
    : renderEmptyState({
        icon: 'event_busy',
        title: 'No hay reservas en esta categoría',
        description: 'Puedes solicitar una nueva tutoría o reservar un espacio de investigación cuando lo necesites.',
        actionLabel: 'Ver todas las reservas',
        actionName: 'reset-reservas-tab'
      });

  return `
    <div class="flex flex-col w-full gap-space-md animate-view-in">
      <!-- Cabecera de página -->
      <section class="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 class="font-headline-md text-headline-md text-ink tracking-tight">Mis Reservas</h2>
          <p class="font-body-sm text-body-sm text-ink-muted mt-0.5">
            Supervisa tus tutorías programadas y puestos de laboratorio activos
          </p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          ${renderStatusBadge('menta', 'Semestre Activo', { pulse: true })}
          <button
            type="button"
            data-action="reset-demo-data"
            title="Restaurar reservas y cupos de demostración"
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container hover:bg-pastel-melocoton hover:text-pastel-melocoton-ink text-ink-muted font-label-sm transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-[15px]" aria-hidden="true">restart_alt</span>
            <span>Restablecer demo</span>
          </button>
        </div>
      </section>

      <!-- Resumen rápido por tipo -->
      <section aria-label="Totales de reservas activas" class="grid grid-cols-2 gap-3">
        <div class="flex items-center gap-3 p-3.5 card-elevated rounded-2xl">
          <div class="w-11 h-11 rounded-xl bg-pastel-cielo border border-pastel-cielo-border/70 flex items-center justify-center text-pastel-cielo-ink shrink-0">
            <span class="material-symbols-outlined text-[22px]" aria-hidden="true">biotech</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-label-sm text-label-sm text-ink-muted">Laboratorios</span>
            <span class="font-headline-sm text-headline-sm text-ink font-bold tabular-nums">
              ${stats.labsActivos} ${stats.labsActivos === 1 ? 'activo' : 'activos'}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 p-3.5 card-elevated rounded-2xl">
          <div class="w-11 h-11 rounded-xl bg-pastel-lila border border-pastel-lila-border/70 flex items-center justify-center text-pastel-lila-ink shrink-0">
            <span class="material-symbols-outlined text-[22px]" aria-hidden="true">school</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-label-sm text-label-sm text-ink-muted">Tutorías</span>
            <span class="font-headline-sm text-headline-sm text-ink font-bold tabular-nums">
              ${stats.tutsActivas} ${stats.tutsActivas === 1 ? 'asignada' : 'asignadas'}
            </span>
          </div>
        </div>
      </section>

      <!-- Pestañas de filtrado -->
      <div role="tablist" aria-label="Filtrar reservas" class="flex items-center p-1 bg-surface-container rounded-2xl gap-1">
        ${tabsHtml}
      </div>

      <!-- Listado de tarjetas de reserva -->
      <section aria-label="Listado de reservas">
        ${listHtml}
      </section>

      <!-- Consejo de convivencia -->
      ${renderTipBanner({
        icon: 'verified_user',
        textHtml:
          'Cancela con al menos <strong class="text-ink">2 horas de antelación</strong> para no penalizar tu reputación en el campus virtual.',
        variant: 'menta'
      })}
    </div>
  `;
}

export function bindMisReservasEvents(container, { store }) {
  container.querySelectorAll('[data-reservas-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.setReservasTab(btn.getAttribute('data-reservas-tab'));
    });
  });

  container.querySelector('[data-action="reset-reservas-tab"]')?.addEventListener('click', () => {
    store.setReservasTab('todas');
  });
}

