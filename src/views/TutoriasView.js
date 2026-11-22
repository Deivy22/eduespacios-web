/**
 * Vista Principal: "Tutorías Académicas"
 * Búsqueda, filtrado combinado (asignatura, turno, docente) y solicitud interactiva.
 */
import { ASIGNATURAS_FILTRO, TURNOS_FILTRO, DOCENTES_FILTRO } from '../data/mockData.js';
import { escapeHtml, renderStatusBadge } from '../components/StatusBadge.js';
import { renderTutoriaCard, renderEmptyState, renderTipBanner } from '../components/Card.js';
import { showToast } from '../components/Toast.js';

function renderTutoriasResultsBlock(filtradas, store) {
  const countText = `${filtradas.length} tutoría${filtradas.length === 1 ? '' : 's'} disponible${
    filtradas.length === 1 ? '' : 's'
  } esta semana`;

  const gridHtml = filtradas.length
    ? `<div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
         ${filtradas
           .map((t) => renderTutoriaCard(t, store.getSelectedTutoriaSlot(t.id)))
           .join('')}
       </div>`
    : renderEmptyState({
        icon: 'search_off',
        title: 'Sin tutorías coincidentes',
        description: 'Prueba a restablecer los filtros para consultar otras asignaturas o docentes.',
        actionLabel: 'Restablecer filtros',
        actionName: 'reset-tutorias-filters'
      });

  return { countText, gridHtml };
}

export function renderTutoriasView(state, store) {
  const { tutoriasFilters } = state;
  const filtradas = store.getFilteredTutorias();
  const { countText, gridHtml } = renderTutoriasResultsBlock(filtradas, store);

  const subjectPillsHtml = ASIGNATURAS_FILTRO.map((sub) => {
    const active = tutoriasFilters.subject === sub.id;
    return `
      <button
        type="button"
        data-subject-filter="${escapeHtml(sub.id)}"
        class="shrink-0 px-3.5 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
          active
            ? 'bg-ink text-white shadow-xs'
            : 'bg-surface-container-low text-ink-muted hover:bg-surface-container hover:text-ink'
        }"
      >
        ${escapeHtml(sub.label)}
      </button>
    `;
  }).join('');

  const turnoOptionsHtml = TURNOS_FILTRO.map(
    (t) =>
      `<option value="${escapeHtml(t.id)}" ${tutoriasFilters.shift === t.id ? 'selected' : ''}>${escapeHtml(
        t.label
      )}</option>`
  ).join('');

  const docenteOptionsHtml = DOCENTES_FILTRO.map(
    (d) =>
      `<option value="${escapeHtml(d.id)}" ${tutoriasFilters.teacher === d.id ? 'selected' : ''}>${escapeHtml(
        d.label
      )}</option>`
  ).join('');

  return `
    <div class="flex flex-col w-full gap-space-md animate-view-in">
      <!-- Encabezado de Sección -->
      <section class="flex flex-col gap-1.5">
        <div class="self-start">
          ${renderStatusBadge('lila', 'Acompañamiento Docente', { icon: 'auto_stories' })}
        </div>
        <h2 class="font-headline-md text-headline-md text-ink tracking-tight mt-0.5">
          Tutorías Académicas
        </h2>
        <p class="font-body-md text-body-md text-ink-muted">
          Agenda sesiones personalizadas o grupales para resolver dudas clave con tus docentes.
        </p>
      </section>

      <!-- Barra de búsqueda y filtros -->
      <section aria-label="Filtros de tutorías" class="flex flex-col gap-3">
        <!-- Buscador -->
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none" aria-hidden="true">search</span>
          <input
            id="tutorias-search-input"
            type="search"
            value="${escapeHtml(tutoriasFilters.search)}"
            placeholder="Buscar por asignatura, tema o docente..."
            class="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-ink/10 text-ink font-body-md placeholder:text-outline shadow-xs focus:ring-2 focus:ring-secondary/30 transition-all"
          />
        </div>

        <!-- Pills de asignatura -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          ${subjectPillsHtml}
        </div>

        <!-- Filtros secundarios: Turno y Docente -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div class="relative bg-white border border-ink/10 rounded-xl shadow-xs px-3.5 py-2 flex items-center justify-between">
            <div class="flex flex-col min-w-0 w-full">
              <label for="tutorias-time-filter" class="font-label-sm text-[10px] text-ink-muted uppercase tracking-wider">Turno</label>
              <select
                id="tutorias-time-filter"
                class="w-full bg-transparent font-label-md text-ink focus:outline-none cursor-pointer pr-6 appearance-none"
              >
                ${turnoOptionsHtml}
              </select>
            </div>
            <span class="material-symbols-outlined text-outline text-[18px] pointer-events-none absolute right-3" aria-hidden="true">expand_more</span>
          </div>

          <div class="relative bg-white border border-ink/10 rounded-xl shadow-xs px-3.5 py-2 flex items-center justify-between">
            <div class="flex flex-col min-w-0 w-full">
              <label for="tutorias-docent-filter" class="font-label-sm text-[10px] text-ink-muted uppercase tracking-wider">Docente</label>
              <select
                id="tutorias-docent-filter"
                class="w-full bg-transparent font-label-md text-ink focus:outline-none cursor-pointer pr-6 appearance-none truncate"
              >
                ${docenteOptionsHtml}
              </select>
            </div>
            <span class="material-symbols-outlined text-outline text-[18px] pointer-events-none absolute right-3" aria-hidden="true">expand_more</span>
          </div>
        </div>
      </section>

      <!-- Contador dinámico -->
      <div class="flex items-center justify-between gap-2 px-0.5">
        <span id="tutorias-results-count" class="font-label-md text-label-md text-ink-muted">
          ${escapeHtml(countText)}
        </span>
        ${renderStatusBadge('lila', 'Actualizado hoy', { pulse: true })}
      </div>

      <!-- Listado de tutorías -->
      <section id="tutorias-results-grid" aria-label="Lista de tutorías disponibles">
        ${gridHtml}
      </section>

      <!-- Banner informativo -->
      ${renderTipBanner({
        icon: 'lightbulb',
        title: '¿Necesitas asesoría personalizada adicional?',
        textHtml:
          'Puedes proponer horarios extraordinarios directamente con tu coordinador de carrera desde el correo institucional.',
        variant: 'lila'
      })}
    </div>
  `;
}

export function bindTutoriasEvents(container, { store }) {
  // Búsqueda en vivo sin perder el foco del input
  const searchInput = container.querySelector('#tutorias-search-input');
  searchInput?.addEventListener('input', (e) => {
    store.state.tutoriasFilters.search = e.target.value;
    const filtradas = store.getFilteredTutorias();
    const { countText, gridHtml } = renderTutoriasResultsBlock(filtradas, store);

    const countEl = container.querySelector('#tutorias-results-count');
    const gridEl = container.querySelector('#tutorias-results-grid');
    if (countEl) countEl.textContent = countText;
    if (gridEl) {
      gridEl.innerHTML = gridHtml;
      bindResetBtn(gridEl, store);
    }
  });

  // Pills de asignatura
  container.querySelectorAll('[data-subject-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.setTutoriasFilter({ subject: btn.getAttribute('data-subject-filter') });
    });
  });

  // Selectores de turno y docente
  container.querySelector('#tutorias-time-filter')?.addEventListener('change', (e) => {
    store.setTutoriasFilter({ shift: e.target.value });
  });

  container.querySelector('#tutorias-docent-filter')?.addEventListener('change', (e) => {
    store.setTutoriasFilter({ teacher: e.target.value });
  });

  bindResetBtn(container, store);
}

function bindResetBtn(scope, store) {
  scope.querySelector('[data-action="reset-tutorias-filters"]')?.addEventListener('click', () => {
    store.resetTutoriasFilters();
    showToast('Filtros de tutorías restablecidos', { icon: 'filter_alt_off', tone: 'info' });
  });
}

