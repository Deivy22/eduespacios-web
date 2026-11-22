/**
 * Componente reutilizable: Insignias y Chips de Estado (StatusBadge)
 * Implementa la semántica cromática pastel de alto contraste (WCAG AAA) de EduEspacios.
 */

const VARIANT_STYLES = {
  confirmada: {
    bg: 'bg-pastel-menta border-pastel-menta-border text-pastel-menta-ink',
    dot: 'bg-pastel-menta-dot',
    defaultLabel: 'Confirmada'
  },
  libre: {
    bg: 'bg-pastel-menta border-pastel-menta-border text-pastel-menta-ink',
    dot: 'bg-pastel-menta-dot',
    defaultLabel: 'Libre'
  },
  pendiente: {
    bg: 'bg-pastel-melocoton border-pastel-melocoton-border text-pastel-melocoton-ink',
    dot: 'bg-pastel-melocoton-dot',
    defaultLabel: 'Pendiente de aprobación'
  },
  cancelada: {
    bg: 'bg-error-container border-pastel-rosa-border text-on-error-container',
    dot: 'bg-error',
    defaultLabel: 'Cancelada'
  },
  ocupado: {
    bg: 'bg-pastel-rosa border-pastel-rosa-border text-pastel-rosa-ink',
    dot: 'bg-pastel-rosa-ink',
    defaultLabel: 'Ocupado'
  },
  lila: {
    bg: 'bg-pastel-lila border-pastel-lila-border text-pastel-lila-ink',
    dot: 'bg-secondary',
    defaultLabel: 'Tutoría'
  },
  cielo: {
    bg: 'bg-pastel-cielo border-pastel-cielo-border text-pastel-cielo-ink',
    dot: 'bg-pastel-cielo-ink',
    defaultLabel: 'En revisión'
  },
  menta: {
    bg: 'bg-pastel-menta border-pastel-menta-border text-pastel-menta-ink',
    dot: 'bg-pastel-menta-dot',
    defaultLabel: 'Disponible'
  },
  melocoton: {
    bg: 'bg-pastel-melocoton border-pastel-melocoton-border text-pastel-melocoton-ink',
    dot: 'bg-pastel-melocoton-dot',
    defaultLabel: 'Aviso'
  },
  neutral: {
    bg: 'bg-surface-container border-outline-variant/40 text-ink-muted',
    dot: 'bg-outline',
    defaultLabel: 'Info'
  }
};

export function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Renderiza una insignia de estado en formato pastilla.
 */
export function renderStatusBadge(variant = 'neutral', label = null, options = {}) {
  const { showDot = true, pulse = false, icon = null, extraClass = '' } = options;
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;
  const text = escapeHtml(label || style.defaultLabel);

  const indicator = icon
    ? `<span class="material-symbols-outlined text-[14px] icon-filled" aria-hidden="true">${escapeHtml(icon)}</span>`
    : showDot
      ? `<span class="w-1.5 h-1.5 rounded-full ${style.dot} ${pulse ? 'animate-pulse' : ''}" aria-hidden="true"></span>`
      : '';

  return `
    <span class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-label-sm text-label-sm ${style.bg} ${extraClass}">
      ${indicator}
      <span>${text}</span>
    </span>
  `;
}

/**
 * Renderiza el chip semántico de cupos disponibles para una tutoría.
 */
export function renderCuposBadge(cupos) {
  if (cupos <= 0) {
    return renderStatusBadge('cancelada', 'Sin cupos');
  }
  if (cupos === 1) {
    return renderStatusBadge('melocoton', '1 cupo restante');
  }
  if (cupos === 2) {
    return renderStatusBadge('lila', '2 cupos');
  }
  return renderStatusBadge('menta', `${cupos} cupos libres`);
}

