/**
 * Componente reutilizable: Notificación Toast flotante unificada.
 */
import { escapeHtml } from './StatusBadge.js';

let toastTimer = null;

/**
 * Muestra un mensaje flotante accesible en la parte inferior/superior de la pantalla.
 * @param {string} message - Mensaje principal.
 * @param {object} [options]
 * @param {string} [options.subtitle] - Subtítulo opcional.
 * @param {string} [options.icon='check_circle'] - Icono de Material Symbols.
 * @param {'success'|'info'|'warning'|'error'} [options.tone='success']
 * @param {number} [options.duration=3400]
 */
export function showToast(
  message,
  { subtitle = '', icon = 'check_circle', tone = 'success', duration = 3400 } = {}
) {
  const root = document.getElementById('app-toast-root');
  if (!root) return;

  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  const iconToneClass = {
    success: 'bg-pastel-menta-dot text-white',
    info: 'bg-secondary text-white',
    warning: 'bg-pastel-melocoton-dot text-ink',
    error: 'bg-error text-white'
  }[tone] || 'bg-pastel-menta-dot text-white';

  root.innerHTML = `
    <div
      id="active-toast"
      role="status"
      class="fixed bottom-20 md:bottom-6 inset-x-4 max-w-md mx-auto z-50 bg-ink text-white p-3.5 rounded-2xl shadow-modal flex items-center justify-between gap-3 transition-all duration-300 translate-y-4 opacity-0"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 rounded-full ${iconToneClass} flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[19px] icon-filled" aria-hidden="true">${escapeHtml(icon)}</span>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-label-md text-label-md font-semibold text-white leading-tight truncate">
            ${escapeHtml(message)}
          </span>
          ${
            subtitle
              ? `<span class="font-body-sm text-[12px] text-inverse-on-surface/85 leading-snug mt-0.5">${escapeHtml(subtitle)}</span>`
              : ''
          }
        </div>
      </div>
      <button
        type="button"
        id="close-toast-btn"
        aria-label="Cerrar notificación"
        class="p-1 rounded-lg text-inverse-on-surface/75 hover:text-white hover:bg-white/10 transition-colors shrink-0"
      >
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  `;

  const toastEl = document.getElementById('active-toast');
  const closeBtn = document.getElementById('close-toast-btn');

  requestAnimationFrame(() => {
    if (toastEl) {
      toastEl.classList.remove('translate-y-4', 'opacity-0');
      toastEl.classList.add('translate-y-0', 'opacity-100');
    }
  });

  const dismiss = () => {
    if (!toastEl) return;
    toastEl.classList.add('translate-y-4', 'opacity-0');
    toastEl.classList.remove('translate-y-0', 'opacity-100');
    setTimeout(() => {
      if (root.contains(toastEl)) root.innerHTML = '';
    }, 260);
  };

  closeBtn?.addEventListener('click', dismiss);
  toastTimer = setTimeout(dismiss, duration);
}

