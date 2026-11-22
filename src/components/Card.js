/**
 * Componente reutilizable: Colección de Tarjetas de EduEspacios
 * Incluye tarjetas KPI, Bento de servicios, Actividades, Tutorías, Reservas,
 * Banners de consejo y Estados vacíos.
 */
import { escapeHtml, renderStatusBadge, renderCuposBadge } from './StatusBadge.js';

const AVATAR_THEMES = {
  lila: 'bg-pastel-lila text-pastel-lila-ink border border-pastel-lila-border/60',
  cielo: 'bg-pastel-cielo text-pastel-cielo-ink border border-pastel-cielo-border/60',
  menta: 'bg-pastel-menta text-pastel-menta-ink border border-pastel-menta-border/60',
  melocoton: 'bg-pastel-melocoton text-pastel-melocoton-ink border border-pastel-melocoton-border/60'
};

/**
 * Tarjeta compacta de métrica (KPI) para Inicio.
 */
export function renderStatCard({
  icon,
  iconColorClass = 'text-secondary',
  topLabel = '',
  showDot = false,
  value,
  unit = '',
  subtitle,
  elevated = false,
  targetRoute = null
}) {
  const bg = elevated ? 'bg-surface-container-high' : 'bg-surface-container';
  const tag = targetRoute ? 'button' : 'div';
  const attrs = targetRoute
    ? `type="button" data-nav-route="${targetRoute}" class="text-left flex flex-col p-3.5 rounded-2xl ${bg} border border-ink/5 shadow-xs transition-transform active:scale-[0.98] hover:shadow-soft cursor-pointer"`
    : `class="flex flex-col p-3.5 rounded-2xl ${bg} border border-ink/5 shadow-xs"`;

  return `
    <${tag} ${attrs}>
      <div class="flex items-center justify-between mb-2">
        <span class="material-symbols-outlined text-[19px] ${iconColorClass}" aria-hidden="true">${escapeHtml(icon)}</span>
        ${
          showDot
            ? '<span class="w-2 h-2 rounded-full bg-secondary" aria-hidden="true"></span>'
            : `<span class="font-label-sm text-label-sm text-ink-muted">${escapeHtml(topLabel)}</span>`
        }
      </div>
      <span class="font-headline-md text-headline-md text-ink font-extrabold leading-none tabular-nums">
        ${escapeHtml(value)}${unit ? `<span class="text-sm font-semibold text-ink-muted ml-0.5">${escapeHtml(unit)}</span>` : ''}
      </span>
      <span class="font-label-sm text-label-sm text-ink-muted mt-1.5">${escapeHtml(subtitle)}</span>
    </${tag}>
  `;
}

/**
 * Tarjeta Bento de servicio principal (Lila para Tutorías, Menta para Laboratorios).
 */
export function renderBentoServiceCard({
  id,
  variant = 'lila',
  icon,
  badgeText,
  title,
  description,
  ctaLabel,
  targetRoute
}) {
  const isLila = variant === 'lila';
  const containerTheme = isLila
    ? 'bg-pastel-lila border-pastel-lila-border/70 text-pastel-lila-ink'
    : 'bg-pastel-menta border-pastel-menta-border/70 text-pastel-menta-ink';

  const iconColor = isLila ? 'text-secondary' : 'text-pastel-menta-ink';
  const badgeColor = isLila ? 'text-pastel-lila-ink' : 'text-pastel-menta-ink';
  const descColor = isLila ? 'text-pastel-lila-ink/85' : 'text-pastel-menta-ink/85';
  const watermarkColor = isLila ? 'text-pastel-lila-ink/10' : 'text-pastel-menta-ink/10';

  return `
    <article
      id="${escapeHtml(id)}"
      class="relative overflow-hidden rounded-3xl p-5 border ${containerTheme} shadow-soft flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div class="absolute -right-4 -bottom-6 w-32 h-32 rounded-full bg-white/30 pointer-events-none flex items-center justify-center" aria-hidden="true">
        <span class="material-symbols-outlined text-[84px] ${watermarkColor}">${escapeHtml(icon)}</span>
      </div>

      <div class="relative z-10 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-2">
          <div class="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-xs">
            <span class="material-symbols-outlined ${iconColor} text-[24px]" aria-hidden="true">${escapeHtml(icon)}</span>
          </div>
          <span class="px-3 py-1 rounded-full font-label-sm text-label-sm bg-white/95 ${badgeColor} font-bold shadow-xs">
            ${escapeHtml(badgeText)}
          </span>
        </div>

        <div class="mt-0.5">
          <h4 class="font-headline-sm text-headline-sm font-bold text-ink">
            ${escapeHtml(title)}
          </h4>
          <p class="font-body-md text-body-md ${descColor} mt-1 max-w-[90%]">
            ${escapeHtml(description)}
          </p>
        </div>
      </div>

      <div class="relative z-10 pt-1">
        <button
          type="button"
          data-nav-route="${escapeHtml(targetRoute)}"
          class="w-full h-11 px-4 rounded-xl bg-ink text-white font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:bg-ink-body active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>${escapeHtml(ctaLabel)}</span>
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
    </article>
  `;
}

/**
 * Tarjeta compacta de próxima actividad (Vista Inicio).
 */
export function renderActivityCard(reserva) {
  const isTutoria = reserva.categoria === 'tutoria';
  const avatarBlock = reserva.iniciales
    ? `<div class="w-10 h-10 rounded-full bg-pastel-lila border border-pastel-lila-border/70 text-pastel-lila-ink flex items-center justify-center shrink-0 font-bold font-label-md">
         ${escapeHtml(reserva.iniciales)}
       </div>`
    : `<div class="w-10 h-10 rounded-full bg-pastel-cielo border border-pastel-cielo-border/70 text-pastel-cielo-ink flex items-center justify-center shrink-0">
         <span class="material-symbols-outlined text-[20px]" aria-hidden="true">${escapeHtml(reserva.icono)}</span>
       </div>`;

  const badgeLabel = reserva.estado === 'pendiente' ? 'Pendiente' : 'Confirmada';

  return `
    <article class="p-4 rounded-2xl card-elevated flex flex-col gap-3 transition-all">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0">
          ${avatarBlock}
          <div class="min-w-0 flex flex-col">
            <span class="font-label-sm text-label-sm uppercase font-bold tracking-wider ${
              isTutoria ? 'text-pastel-lila-ink' : 'text-pastel-menta-ink'
            }">
              ${isTutoria ? 'Tutoría' : 'Laboratorio'}
            </span>
            <h4 class="font-label-lg text-label-lg text-ink truncate">${escapeHtml(reserva.titulo)}</h4>
            <p class="font-body-sm text-body-sm text-ink-muted truncate">${escapeHtml(reserva.subtitulo)}</p>
          </div>
        </div>
        ${renderStatusBadge(reserva.estado, badgeLabel)}
      </div>

      <div class="flex items-center justify-between gap-2 bg-surface-container-low p-2.5 rounded-xl">
        <div class="flex flex-col min-w-0">
          <span class="font-label-sm text-label-sm text-ink font-semibold flex items-center gap-1.5 tabular-nums">
            <span class="material-symbols-outlined text-[15px] text-secondary shrink-0" aria-hidden="true">${escapeHtml(reserva.iconoHorario)}</span>
            <span class="truncate">${escapeHtml(reserva.horario)}</span>
          </span>
          <span class="font-body-sm text-body-sm text-ink-muted flex items-center gap-1.5 mt-0.5">
            <span class="material-symbols-outlined text-[15px] text-outline shrink-0" aria-hidden="true">location_on</span>
            <span class="truncate">${escapeHtml(reserva.ubicacionCorta)}</span>
          </span>
        </div>

        <button
          type="button"
          data-action="open-qr-pass"
          data-reserva-id="${escapeHtml(reserva.id)}"
          class="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-ink/10 text-ink font-label-md text-label-md shadow-xs hover:bg-surface-container active:scale-95 transition-all flex items-center gap-1"
        >
          <span>${escapeHtml(reserva.accionInicioLabel)}</span>
          <span class="material-symbols-outlined text-[15px]" aria-hidden="true">${escapeHtml(reserva.accionInicioIcono)}</span>
        </button>
      </div>
    </article>
  `;
}

/**
 * Tarjeta de oferta de tutoría docente (Vista Tutorías Académicas).
 * Incluye selector previo de franja de 30 min para precargarla en el modal de solicitud.
 */
export function renderTutoriaCard(tutoria, selectedFranja = null) {
  const avatarClass = AVATAR_THEMES[tutoria.avatarTema] || AVATAR_THEMES.lila;
  const reservadas = Array.isArray(tutoria.franjasReservadas) ? tutoria.franjasReservadas : [];
  const sinCupos = tutoria.cupos <= 0 || reservadas.length >= tutoria.franjas.length;

  const franjasHtml = tutoria.franjas
    .map((franja) => {
      const yaReservada = reservadas.includes(franja);
      const isSelected = !yaReservada && franja === selectedFranja;

      if (yaReservada) {
        return `
          <button
            type="button"
            disabled
            title="Franja ya reservada por ti"
            class="px-2.5 py-1.5 rounded-lg bg-pastel-lila/50 border border-pastel-lila-border/60 text-pastel-lila-ink/70 font-label-sm tabular-nums line-through cursor-not-allowed"
          >
            ${escapeHtml(franja)}
          </button>
        `;
      }

      return `
        <button
          type="button"
          data-action="select-tutoria-slot"
          data-tutoria-id="${escapeHtml(tutoria.id)}"
          data-franja="${escapeHtml(franja)}"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          class="px-2.5 py-1.5 rounded-lg font-label-sm tabular-nums transition-all cursor-pointer ${
            isSelected
              ? 'bg-ink text-white shadow-xs ring-2 ring-secondary/40'
              : 'bg-white border border-ink/12 text-ink hover:bg-pastel-menta hover:border-pastel-menta-border hover:text-pastel-menta-ink'
          }"
        >
          ${escapeHtml(franja)}
        </button>
      `;
    })
    .join('');

  return `
    <article class="card-elevated rounded-2xl p-space-md flex flex-col justify-between gap-3.5 transition-all">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <div class="relative w-12 h-12 rounded-xl ${avatarClass} flex items-center justify-center font-headline-sm text-headline-sm shrink-0">
            ${escapeHtml(tutoria.iniciales)}
            <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span class="w-2.5 h-2.5 rounded-full ${sinCupos ? 'bg-outline' : 'bg-pastel-menta-dot'}"></span>
            </span>
          </div>
          <div class="flex flex-col min-w-0">
            <h3 class="font-headline-sm text-headline-sm text-ink leading-snug truncate">
              ${escapeHtml(tutoria.asignatura)}
            </h3>
            <p class="font-body-sm text-body-sm text-ink-body font-medium truncate">
              ${escapeHtml(tutoria.docente)}
              <span class="text-ink-muted font-normal">• ${escapeHtml(tutoria.especialidad)}</span>
            </p>
          </div>
        </div>
        ${renderCuposBadge(tutoria.cupos)}
      </div>

      <!-- Metadatos de horario y modalidad -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-container-low rounded-xl p-3 text-ink">
        <div class="flex items-center gap-2 min-w-0">
          <span class="material-symbols-outlined text-[18px] text-secondary shrink-0" aria-hidden="true">calendar_today</span>
          <div class="flex flex-col min-w-0">
            <span class="font-label-sm text-[10px] text-ink-muted uppercase tracking-wider leading-tight">Horario</span>
            <span class="font-label-md text-label-md font-semibold tabular-nums truncate">${escapeHtml(tutoria.horarioCorto)}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="material-symbols-outlined text-[18px] text-secondary shrink-0" aria-hidden="true">${escapeHtml(tutoria.modalidadIcono)}</span>
          <div class="flex flex-col min-w-0">
            <span class="font-label-sm text-[10px] text-ink-muted uppercase tracking-wider leading-tight">Modalidad</span>
            <span class="font-label-md text-label-md font-semibold truncate">${escapeHtml(tutoria.modalidadTexto)}</span>
          </div>
        </div>
      </div>

      <!-- Franjas seleccionables de 30 minutos -->
      <div class="flex flex-col gap-1.5">
        <span class="font-label-sm text-[10px] text-ink-muted uppercase tracking-wider">
          Elige horario (30 min) para precargar solicitud:
        </span>
        <div class="flex flex-wrap gap-1.5">
          ${franjasHtml}
        </div>
      </div>

      <!-- Pie de tarjeta con duración y acción -->
      <div class="flex items-center justify-between gap-2 pt-0.5 border-t border-surface-container">
        <div class="flex items-center gap-1.5 text-ink-muted font-body-sm text-[12px]">
          <span class="material-symbols-outlined text-[16px] text-outline" aria-hidden="true">${escapeHtml(tutoria.iconoDuracion)}</span>
          <span>${escapeHtml(tutoria.etiquetaDuracion)}</span>
        </div>

        <button
          type="button"
          data-action="open-tutoria-modal"
          data-tutoria-id="${escapeHtml(tutoria.id)}"
          ${sinCupos ? 'disabled' : ''}
          class="px-4 h-10 rounded-xl font-label-md text-label-md inline-flex items-center gap-1.5 transition-all ${
            sinCupos
              ? 'bg-surface-container text-ink-muted cursor-not-allowed'
              : 'bg-ink text-white hover:bg-ink-body active:scale-95 shadow-xs cursor-pointer'
          }"
        >
          <span>${sinCupos ? 'Sin disponibilidad' : 'Solicitar Tutoría'}</span>
          ${sinCupos ? '' : '<span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>'}
        </button>
      </div>
    </article>
  `;
}

/**
 * Tarjeta completa de reserva gestionable (Vista Mis Reservas).
 */
export function renderReservationCard(reserva) {
  const isCancelada = reserva.estado === 'cancelada';

  const iconPalette = {
    cielo: { box: 'bg-pastel-cielo text-pastel-cielo-ink border-pastel-cielo-border/70', label: 'text-pastel-cielo-ink' },
    lila: { box: 'bg-pastel-lila text-pastel-lila-ink border-pastel-lila-border/70', label: 'text-pastel-lila-ink' },
    melocoton: { box: 'bg-pastel-melocoton text-pastel-melocoton-ink border-pastel-melocoton-border/70', label: 'text-pastel-melocoton-ink' },
    menta: { box: 'bg-pastel-menta text-pastel-menta-ink border-pastel-menta-border/70', label: 'text-pastel-menta-ink' }
  }[reserva.tema] || { box: 'bg-pastel-cielo text-pastel-cielo-ink border-pastel-cielo-border/70', label: 'text-pastel-cielo-ink' };

  return `
    <article
      class="rounded-2xl p-space-md flex flex-col justify-between gap-3 transition-all duration-300 ${
        isCancelada
          ? 'bg-surface-container-low border border-ink/5 opacity-75'
          : 'card-elevated'
      }"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-start gap-2.5 min-w-0">
          <div class="w-11 h-11 shrink-0 rounded-xl border ${iconPalette.box} flex items-center justify-center shadow-xs">
            <span class="material-symbols-outlined text-[23px]" aria-hidden="true">${escapeHtml(reserva.icono)}</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-label-sm text-label-sm ${iconPalette.label} uppercase tracking-wide">
              ${escapeHtml(reserva.etiquetaCategoria)}
            </span>
            <h3 class="font-label-lg text-label-lg text-ink truncate">${escapeHtml(reserva.titulo)}</h3>
            <p class="font-body-sm text-body-sm text-ink-muted truncate">${escapeHtml(reserva.subtitulo)}</p>
          </div>
        </div>
        ${renderStatusBadge(reserva.estado)}
      </div>

      <!-- Horario y código de ticket -->
      <div class="flex items-center justify-between gap-2 py-2 px-3 bg-surface-container-low rounded-xl text-ink-body">
        <div class="flex items-center gap-2 min-w-0">
          <span class="material-symbols-outlined text-[18px] text-ink-muted shrink-0" aria-hidden="true">${escapeHtml(reserva.iconoHorario)}</span>
          <span class="font-label-md text-label-md font-semibold text-ink tabular-nums truncate">${escapeHtml(reserva.horario)}</span>
        </div>
        <span class="font-label-sm text-label-sm text-ink-muted font-mono tracking-wider shrink-0">
          ${escapeHtml(reserva.codigo)}
        </span>
      </div>

      <!-- Acciones de la reserva -->
      <div class="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          data-action="open-qr-pass"
          data-reserva-id="${escapeHtml(reserva.id)}"
          class="flex-1 h-10 px-3 rounded-xl bg-ink text-white font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] hover:bg-ink-body shadow-xs cursor-pointer"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">${escapeHtml(reserva.accionPrincipalIcono)}</span>
          <span>${escapeHtml(reserva.accionPrincipalLabel)}</span>
        </button>

        ${
          isCancelada
            ? `<button
                type="button"
                data-action="remove-cancelled-reserva"
                data-reserva-id="${escapeHtml(reserva.id)}"
                title="Retirar reserva cancelada de la lista"
                class="h-10 px-3 rounded-xl bg-surface-container text-ink-muted hover:bg-error-container hover:text-on-error-container font-label-md text-label-md flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined text-[18px]" aria-hidden="true">delete_outline</span>
                <span>Retirar</span>
              </button>`
            : `<button
                type="button"
                data-action="prompt-cancel-reserva"
                data-reserva-id="${escapeHtml(reserva.id)}"
                class="h-10 px-3 rounded-xl bg-transparent border border-pastel-melocoton-border/80 text-pastel-melocoton-ink hover:bg-pastel-melocoton font-label-md text-label-md flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined text-[18px]" aria-hidden="true">cancel</span>
                <span>Cancelar</span>
              </button>`
        }
      </div>
    </article>
  `;
}

/**
 * Estado vacío reutilizable con acción de recuperación.
 */
export function renderEmptyState({ icon = 'search_off', title, description, actionLabel, actionName }) {
  return `
    <div class="flex flex-col items-center justify-center text-center p-8 bg-white border border-ink/5 rounded-2xl shadow-xs">
      <div class="w-14 h-14 rounded-full bg-pastel-lila border border-pastel-lila-border/70 flex items-center justify-center text-pastel-lila-ink mb-3">
        <span class="material-symbols-outlined text-[28px]" aria-hidden="true">${escapeHtml(icon)}</span>
      </div>
      <h4 class="font-headline-sm text-headline-sm text-ink mb-1">${escapeHtml(title)}</h4>
      <p class="font-body-md text-body-md text-ink-muted max-w-sm mb-4">${escapeHtml(description)}</p>
      ${
        actionLabel
          ? `<button
              type="button"
              data-action="${escapeHtml(actionName)}"
              class="px-4 h-10 rounded-xl bg-ink text-white font-label-md text-label-md hover:bg-ink-body transition-colors shadow-xs cursor-pointer"
            >
              ${escapeHtml(actionLabel)}
            </button>`
          : ''
      }
    </div>
  `;
}

/**
 * Banner de recomendación institucional reutilizable.
 */
export function renderTipBanner({ icon = 'lightbulb', title = '', textHtml, variant = 'lila' }) {
  const iconBox =
    variant === 'menta'
      ? 'bg-pastel-menta text-pastel-menta-ink border border-pastel-menta-border/70'
      : 'bg-pastel-lila text-pastel-lila-ink border border-pastel-lila-border/70';

  return `
    <section class="p-4 rounded-2xl bg-surface-container-low border border-ink/5 flex items-start gap-3">
      <div class="w-9 h-9 rounded-xl ${iconBox} flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">${escapeHtml(icon)}</span>
      </div>
      <div class="flex flex-col gap-0.5 min-w-0">
        ${title ? `<span class="font-label-md text-label-md text-ink font-bold">${escapeHtml(title)}</span>` : ''}
        <p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">${textHtml}</p>
      </div>
    </section>
  `;
}

