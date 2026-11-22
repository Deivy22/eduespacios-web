/**
 * Componente reutilizable: Barra de Navegación Superior (Escritorio + Móvil)
 * y Barra de Pestañas Inferior (Móvil) para EduEspacios.
 */
import { escapeHtml } from './StatusBadge.js';

export const NAV_ITEMS = [
  { route: 'inicio', label: 'Inicio', headerTitle: 'Inicio', icon: 'home' },
  { route: 'tutorias', label: 'Tutorías', headerTitle: 'Tutorías Académicas', icon: 'school' },
  { route: 'laboratorios', label: 'Laboratorios', headerTitle: 'Laboratorios', icon: 'biotech' },
  { route: 'mis-reservas', label: 'Mis Reservas', headerTitle: 'Mis Reservas', icon: 'event_available' }
];

function renderBrandLogo() {
  return `
    <div class="w-9 h-9 rounded-xl bg-pastel-lila border border-pastel-lila-border/70 flex items-center justify-center text-pastel-lila-ink shadow-xs shrink-0">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L2 8.5L12 14L22 8.5L12 3Z" fill="currentColor" opacity="0.22"/>
        <path d="M12 3L2 8.5L12 14L22 8.5L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M6 11V16.5C6 18 8.7 19.5 12 19.5C15.3 19.5 18 18 18 16.5V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M20 10V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </div>
  `;
}

/**
 * Renderiza la cabecera institucional fija.
 */
export function renderHeader({ currentRoute, estudiante, stats }) {
  const currentMeta = NAV_ITEMS.find((i) => i.route === currentRoute) || NAV_ITEMS[0];

  const desktopLinks = NAV_ITEMS.map((item) => {
    const active = item.route === currentRoute;
    const badge =
      item.route === 'mis-reservas' && stats.totalActivas > 0
        ? `<span class="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold tabular-nums ${
            active
              ? 'bg-white/20 text-white'
              : 'bg-pastel-lila text-pastel-lila-ink'
          }">${stats.totalActivas}</span>`
        : '';

    return `
      <a
        href="#${item.route}"
        data-nav-route="${item.route}"
        ${active ? 'aria-current="page"' : ''}
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-label-md text-label-md transition-all ${
          active
            ? 'bg-ink text-white shadow-xs'
            : 'text-ink-muted hover:text-ink hover:bg-surface-container'
        }"
      >
        <span class="material-symbols-outlined text-[18px] ${active ? 'icon-filled' : ''}" aria-hidden="true">${item.icon}</span>
        <span>${item.label}</span>
        ${badge}
      </a>
    `;
  }).join('');

  return `
    <div class="max-w-5xl mx-auto h-16 px-margin sm:px-margin-tablet flex items-center justify-between gap-3">
      <!-- Marca y título de sección -->
      <a href="#inicio" data-nav-route="inicio" class="flex items-center gap-2.5 group min-w-0">
        ${renderBrandLogo()}
        <div class="flex flex-col min-w-0">
          <span class="font-label-sm text-[10px] text-ink-muted uppercase tracking-wider leading-none">
            EduEspacios • Campus Digital
          </span>
          <h1 class="font-headline-sm text-headline-sm text-ink leading-tight truncate md:hidden">
            ${escapeHtml(currentMeta.headerTitle)}
          </h1>
          <span class="hidden md:block font-headline-sm text-[16px] text-ink font-bold leading-tight">
            Portal Académico
          </span>
        </div>
      </a>

      <!-- Navegación escritorio -->
      <nav aria-label="Navegación principal" class="hidden md:flex items-center gap-1 bg-surface-container-low/80 p-1 rounded-2xl border border-ink/5">
        ${desktopLinks}
      </nav>

      <!-- Acciones de usuario: Notificaciones y Perfil -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          data-action="open-notifications"
          aria-label="Abrir notificaciones${stats.unreadNotifs > 0 ? ` (${stats.unreadNotifs} sin leer)` : ''}"
          class="w-10 h-10 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-container transition-colors relative"
        >
          <span class="material-symbols-outlined text-[22px]">notifications</span>
          ${
            stats.unreadNotifs > 0
              ? `<span class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface"></span>`
              : ''
          }
        </button>

        <button
          type="button"
          data-action="open-profile"
          aria-label="Perfil de ${escapeHtml(estudiante.nombreCompleto)}"
          class="flex items-center gap-2 pl-1 pr-1 sm:pr-2.5 py-1 rounded-full hover:bg-surface-container transition-colors"
        >
          <span class="w-8 h-8 rounded-full bg-pastel-lila border border-pastel-lila-border text-pastel-lila-ink font-label-md font-bold flex items-center justify-center">
            ${escapeHtml(estudiante.iniciales)}
          </span>
          <span class="hidden lg:inline font-label-md text-ink font-semibold">
            ${escapeHtml(estudiante.nombre)}
          </span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Renderiza la barra inferior de navegación móvil (fiel al diseño móvil original).
 */
export function renderBottomNav({ currentRoute, stats }) {
  const links = NAV_ITEMS.map((item) => {
    const active = item.route === currentRoute;
    const countDot =
      item.route === 'mis-reservas' && stats.totalActivas > 0
        ? `<span class="absolute -top-0.5 right-2 min-w-[16px] h-4 px-1 rounded-full bg-pastel-lila border border-pastel-lila-border text-pastel-lila-ink text-[10px] font-bold tabular-nums flex items-center justify-center">${stats.totalActivas}</span>`
        : '';

    return `
      <a
        href="#${item.route}"
        data-nav-route="${item.route}"
        ${active ? 'aria-current="page"' : ''}
        class="relative flex flex-col items-center justify-center gap-0.5 min-w-[68px] h-12 rounded-xl transition-all duration-200 ${
          active
            ? 'text-secondary font-bold'
            : 'text-ink-muted hover:text-ink'
        }"
      >
        <span class="material-symbols-outlined text-[22px] ${active ? 'icon-filled' : ''}" aria-hidden="true">${item.icon}</span>
        <span class="font-label-sm text-label-sm">${item.label}</span>
        ${countDot}
      </a>
    `;
  }).join('');

  return `<div class="flex justify-around items-center h-16 px-space-xs">${links}</div>`;
}

