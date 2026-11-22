/**
 * Componente reutilizable: Gestor de Modales Accesibles de EduEspacios.
 * Incluye: Solicitud de Tutoría, Voucher de Laboratorio, Pase Digital QR,
 * Confirmación de Cancelación, Notificaciones y Perfil Estudiantil.
 */
import { escapeHtml, renderStatusBadge } from './StatusBadge.js';
import { showToast } from './Toast.js';

let activeKeydownHandler = null;

export function closeModal() {
  const root = document.getElementById('app-modal-root');
  if (root) root.innerHTML = '';
  document.body.style.overflow = '';

  if (activeKeydownHandler) {
    document.removeEventListener('keydown', activeKeydownHandler);
    activeKeydownHandler = null;
  }
}

function mountModal(innerHtml, { maxWidthClass = 'sm:max-w-lg', onMount = null } = {}) {
  const root = document.getElementById('app-modal-root');
  if (!root) return;

  closeModal();

  root.innerHTML = `
    <div
      id="modal-backdrop"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 modal-overlay flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        id="modal-panel"
        class="w-full ${maxWidthClass} bg-white rounded-t-3xl sm:rounded-2xl shadow-modal p-space-lg flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-modal-in border border-ink/5"
      >
        ${innerHtml}
      </div>
    </div>
  `;

  document.body.style.overflow = 'hidden';

  const backdrop = document.getElementById('modal-backdrop');
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  root.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  activeKeydownHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', activeKeydownHandler);

  if (typeof onMount === 'function') {
    onMount(root);
  }
}

/**
 * Modal 1: Solicitar / Confirmar Tutoría Académica.
 * Precarga el horario seleccionado desde la tarjeta de tutoría.
 */
export function openBookingTutoriaModal(tutoria, initialSlot, onConfirm) {
  const reservadas = Array.isArray(tutoria.franjasReservadas) ? tutoria.franjasReservadas : [];
  let selectedSlot =
    initialSlot && tutoria.franjas.includes(initialSlot) && !reservadas.includes(initialSlot)
      ? initialSlot
      : tutoria.franjas.find((s) => !reservadas.includes(s)) || tutoria.franjas[0];

  const slotsHtml = tutoria.franjas
    .map((slot) => {
      const yaReservada = reservadas.includes(slot);
      if (yaReservada) {
        return `
          <button
            type="button"
            disabled
            class="p-2.5 rounded-xl text-center font-label-md text-label-md tabular-nums bg-surface-container text-ink-muted line-through opacity-60 cursor-not-allowed"
          >
            ${escapeHtml(slot)}
          </button>
        `;
      }

      const isSelected = slot === selectedSlot;
      return `
        <button
          type="button"
          data-slot-value="${escapeHtml(slot)}"
          class="tutoria-slot-btn p-2.5 rounded-xl text-center font-label-md text-label-md tabular-nums transition-all cursor-pointer ${
            isSelected
              ? 'bg-ink text-white shadow-xs'
              : 'bg-surface-container-low text-ink hover:bg-pastel-menta hover:text-pastel-menta-ink'
          }"
        >
          ${escapeHtml(slot)}
        </button>
      `;
    })
    .join('');

  const html = `
    <div class="flex items-center justify-between pb-2 border-b border-surface-container">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-pastel-lila border border-pastel-lila-border/70 text-pastel-lila-ink flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">event_available</span>
        </div>
        <h3 class="font-headline-sm text-headline-sm text-ink">Confirmar Solicitud</h3>
      </div>
      <button type="button" data-close-modal aria-label="Cerrar modal" class="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:bg-surface-container">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>

    <!-- Resumen de tutoría -->
    <div class="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-1.5">
      <div class="flex items-center justify-between gap-2">
        <span class="font-headline-sm text-[16px] text-ink font-semibold truncate">${escapeHtml(tutoria.asignatura)}</span>
        ${renderStatusBadge('lila', 'Académica', { showDot: false })}
      </div>
      <div class="flex items-center gap-2 text-ink-muted font-body-sm text-body-sm">
        <span class="material-symbols-outlined text-[16px] text-secondary">person</span>
        <span>${escapeHtml(tutoria.docente)}</span>
      </div>
      <div class="flex items-center gap-2 text-ink-muted font-body-sm text-body-sm">
        <span class="material-symbols-outlined text-[16px] text-secondary">schedule</span>
        <span class="tabular-nums">${escapeHtml(tutoria.horarioCompleto)}</span>
      </div>
      <div class="flex items-center gap-2 text-ink-muted font-body-sm text-body-sm">
        <span class="material-symbols-outlined text-[16px] text-secondary">location_on</span>
        <span>${escapeHtml(tutoria.ubicacionDetalle)}</span>
      </div>
    </div>

    <!-- Selector de franja -->
    <div class="flex flex-col gap-2">
      <label class="font-label-md text-label-md text-ink font-semibold">
        Selecciona tu franja horaria preferida (30 min):
      </label>
      <div class="grid grid-cols-3 gap-2" id="modal-tutoria-slots">
        ${slotsHtml}
      </div>
    </div>

    <!-- Tema o dudas -->
    <div class="flex flex-col gap-1.5">
      <label for="consult-topic" class="font-label-md text-label-md text-ink font-semibold flex items-center justify-between">
        <span>Tema o dudas específicas</span>
        <span class="font-label-sm text-ink-muted">Requerido</span>
      </label>
      <textarea
        id="consult-topic"
        rows="3"
        placeholder="Describe brevemente qué temas necesitas reforzar (ej. complejidad asintótica O(n) o grafos)..."
        class="w-full p-3 rounded-xl bg-surface-container-low border border-ink/10 text-ink font-body-md text-body-md placeholder:text-outline focus:bg-white focus:ring-2 focus:ring-secondary/30 transition-all resize-none"
      ></textarea>
      <span id="consult-topic-error" class="hidden font-label-sm text-error">
        Por favor, describe brevemente el tema de tu consulta.
      </span>
    </div>

    <!-- Recordatorio -->
    <label class="flex items-start gap-2.5 cursor-pointer select-none">
      <input id="email-reminder" type="checkbox" checked class="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer" />
      <span class="font-body-sm text-body-sm text-ink-muted">
        Deseo recibir confirmación por correo y sincronizar automáticamente con mi calendario universitario.
      </span>
    </label>

    <!-- Acciones -->
    <div class="flex items-center gap-2 pt-1">
      <button type="button" data-close-modal class="flex-1 h-11 rounded-xl bg-surface-container-low text-ink font-label-md hover:bg-surface-container transition-colors cursor-pointer">
        Cancelar
      </button>
      <button type="button" id="btn-confirm-tutoria" class="flex-1 h-11 rounded-xl bg-ink text-white font-label-md hover:bg-ink-body transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">done</span>
        <span>Confirmar Solicitud</span>
      </button>
    </div>
  `;

  mountModal(html, {
    onMount(root) {
      const slotBtns = root.querySelectorAll('.tutoria-slot-btn');
      slotBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          slotBtns.forEach((b) => {
            b.className =
              'tutoria-slot-btn p-2.5 rounded-xl text-center font-label-md text-label-md tabular-nums transition-all cursor-pointer bg-surface-container-low text-ink hover:bg-pastel-menta hover:text-pastel-menta-ink';
          });
          btn.className =
            'tutoria-slot-btn p-2.5 rounded-xl text-center font-label-md text-label-md tabular-nums transition-all cursor-pointer bg-ink text-white shadow-xs';
          selectedSlot = btn.getAttribute('data-slot-value');
        });
      });

      root.querySelector('#btn-confirm-tutoria')?.addEventListener('click', () => {
        const topicEl = root.querySelector('#consult-topic');
        const errEl = root.querySelector('#consult-topic-error');
        const reminderEl = root.querySelector('#email-reminder');
        const tema = topicEl?.value || '';

        const resultado = onConfirm({
          tutoriaId: tutoria.id,
          franja: selectedSlot,
          tema,
          recordatorio: Boolean(reminderEl?.checked)
        });

        if (resultado && !resultado.ok) {
          if (errEl) {
            errEl.textContent = resultado.error || 'Verifica los datos ingresados.';
            errEl.classList.remove('hidden');
          }
          if (resultado.field === 'tema' && topicEl) {
            topicEl.focus();
            topicEl.classList.add('ring-2', 'ring-error');
            setTimeout(() => topicEl.classList.remove('ring-2', 'ring-error'), 1800);
          } else {
            showToast(resultado.error || 'No fue posible completar la solicitud', {
              icon: 'warning',
              tone: 'warning'
            });
          }
          return;
        }

        closeModal();
      });
    }
  });
}

/**
 * Modal 2: Confirmación / Voucher de Reserva de Laboratorio.
 */
export function openLabConfirmationModal(bookingResult, onGoToReservas) {
  const { reserva, estacionNombre, fecha, horario, labNombre } = bookingResult;

  const html = `
    <div class="flex flex-col items-center text-center gap-3">
      <div class="w-14 h-14 rounded-full bg-pastel-menta border border-pastel-menta-border text-pastel-menta-ink flex items-center justify-center shadow-xs">
        <span class="material-symbols-outlined text-[32px] icon-filled">task_alt</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="font-label-sm text-secondary font-bold uppercase tracking-wider">¡Reserva Autorizada!</span>
        <h3 class="font-headline-md text-headline-md text-ink">Turno Confirmado</h3>
        <p class="font-body-sm text-ink-muted">
          Tu estación ha quedado bloqueada en el sistema central de laboratorios universitarios.
        </p>
      </div>

      <div class="w-full bg-surface-container-low p-4 rounded-xl flex flex-col gap-2 text-left">
        <div class="flex items-center justify-between border-b border-surface-container-high pb-2">
          <span class="font-label-sm text-ink-muted">Código de Ticket</span>
          <span class="font-label-lg text-ink font-mono font-bold tracking-widest">${escapeHtml(reserva.codigo)}</span>
        </div>
        <div class="flex items-center justify-between text-body-sm">
          <span class="text-ink-muted">Laboratorio:</span>
          <span class="font-semibold text-ink text-right">${escapeHtml(labNombre)}</span>
        </div>
        <div class="flex items-center justify-between text-body-sm">
          <span class="text-ink-muted">Estación:</span>
          <span class="font-semibold text-ink">${escapeHtml(estacionNombre)}</span>
        </div>
        <div class="flex items-center justify-between text-body-sm">
          <span class="text-ink-muted">Fecha:</span>
          <span class="font-semibold text-ink">${escapeHtml(fecha)}</span>
        </div>
        <div class="flex items-center justify-between text-body-sm">
          <span class="text-ink-muted">Horario:</span>
          <span class="font-semibold text-pastel-menta-ink tabular-nums">${escapeHtml(horario)}</span>
        </div>
      </div>

      <div class="flex flex-col w-full gap-2 pt-1">
        <button type="button" id="btn-go-reservas" class="w-full h-11 rounded-xl bg-ink text-white font-label-lg shadow-xs hover:bg-ink-body transition-colors cursor-pointer">
          Aceptar y Ver Mis Reservas
        </button>
        <button type="button" id="btn-add-gcal" class="w-full h-10 rounded-xl bg-surface-container-low text-ink font-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[16px]">event</span>
          <span>Añadir a Google Calendar</span>
        </button>
      </div>
    </div>
  `;

  mountModal(html, {
    maxWidthClass: 'sm:max-w-sm',
    onMount(root) {
      root.querySelector('#btn-go-reservas')?.addEventListener('click', () => {
        closeModal();
        onGoToReservas();
      });

      const calBtn = root.querySelector('#btn-add-gcal');
      calBtn?.addEventListener('click', () => {
        calBtn.innerHTML =
          '<span class="material-symbols-outlined text-[16px] text-pastel-menta-dot icon-filled">check_circle</span><span class="text-pastel-menta-ink font-bold">Agregado al Calendario</span>';
        calBtn.classList.add('bg-pastel-menta/60');
        showToast('Evento sincronizado con tu calendario', { icon: 'event_available' });
      });
    }
  });
}

/**
 * Modal 3: Detalle completo y Pase Digital Universitario con Código QR.
 */
export function openQrPassModal(reserva) {
  const extra = reserva.detallesExtra || {};
  const extraRows = [
    extra.docente && { label: 'Docente', value: extra.docente },
    extra.modalidad && { label: 'Modalidad', value: extra.modalidad },
    extra.temaConsulta && { label: 'Tema de consulta', value: extra.temaConsulta },
    extra.estacion && { label: 'Estación asignada', value: extra.estacion },
    extra.motivoPractica && { label: 'Motivo de práctica', value: extra.motivoPractica },
    extra.equipamiento && { label: 'Equipamiento', value: extra.equipamiento }
  ].filter(Boolean);

  const extraBlockHtml = extraRows.length
    ? `
      <div class="bg-surface-container-low rounded-xl p-3 flex flex-col gap-1.5 text-body-sm">
        ${extraRows
          .map(
            (row) => `
            <div class="flex items-start justify-between gap-3">
              <span class="text-ink-muted shrink-0">${escapeHtml(row.label)}:</span>
              <span class="text-ink font-medium text-right">${escapeHtml(row.value)}</span>
            </div>
          `
          )
          .join('')}
      </div>
    `
    : '';

  const html = `
    <div class="flex items-center justify-between pb-1">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-pastel-menta border border-pastel-menta-border flex items-center justify-center text-pastel-menta-ink">
          <span class="material-symbols-outlined text-[18px]">verified</span>
        </div>
        <span class="font-label-lg text-label-lg text-ink font-bold">Detalle y Pase Digital</span>
      </div>
      <button type="button" data-close-modal aria-label="Cerrar pase digital" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>

    <!-- Código QR SVG -->
    <div class="flex flex-col items-center justify-center p-space-md bg-surface-container-low rounded-2xl gap-2.5 text-center">
      <div class="p-3 bg-white rounded-xl shadow-xs border border-ink/5">
        <svg class="w-36 h-36 text-ink" fill="currentColor" viewBox="0 0 120 120" aria-label="Código QR del pase ${escapeHtml(reserva.codigo)}">
          <path d="M10 10h30v30h-30z M15 15v20h20v-20h-20z M20 20h10v10h-10z"></path>
          <path d="M80 10h30v30h-30z M85 15v20h20v-20h-20z M90 20h10v10h-10z"></path>
          <path d="M10 80h30v30h-30z M15 85v20h20v-20h-20z M20 90h10v10h-10z"></path>
          <rect height="5" width="10" x="45" y="15"></rect>
          <rect height="6" width="12" x="60" y="10"></rect>
          <rect height="8" width="8" x="50" y="25"></rect>
          <rect fill="#4e45d5" height="30" rx="4" width="30" x="45" y="45"></rect>
          <circle cx="60" cy="60" fill="#FFFFFF" r="6"></circle>
          <rect height="8" width="8" x="15" y="45"></rect>
          <rect height="15" width="6" x="28" y="52"></rect>
          <rect height="6" width="12" x="10" y="65"></rect>
          <rect height="7" width="15" x="85" y="48"></rect>
          <rect height="12" width="10" x="95" y="60"></rect>
          <rect height="8" width="8" x="82" y="70"></rect>
          <rect height="6" width="14" x="48" y="85"></rect>
          <rect height="12" width="16" x="52" y="98"></rect>
          <rect height="10" width="12" x="75" y="85"></rect>
          <rect height="18" width="15" x="95" y="90"></rect>
        </svg>
      </div>
      <div class="flex flex-col items-center">
        <span class="font-label-sm text-label-sm text-ink-muted uppercase tracking-wider">Código de Identificación</span>
        <span class="font-headline-sm text-headline-sm font-mono text-ink font-bold tracking-wider">${escapeHtml(reserva.codigo)}</span>
      </div>
    </div>

    <!-- Datos principales de la reserva -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-headline-sm text-headline-sm text-ink">${escapeHtml(reserva.titulo)}</h3>
        ${renderStatusBadge(reserva.estado)}
      </div>
      <p class="font-body-md text-body-md text-ink-muted flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[18px] shrink-0">location_on</span>
        <span>${escapeHtml(reserva.subtitulo)}</span>
      </p>
      <p class="font-body-md text-body-md text-ink font-semibold flex items-center gap-1.5 tabular-nums">
        <span class="material-symbols-outlined text-[18px] shrink-0">schedule</span>
        <span>${escapeHtml(reserva.horario)}</span>
      </p>
    </div>

    ${extraBlockHtml}

    <!-- Condiciones de acceso -->
    <div class="p-3 bg-pastel-lila border border-pastel-lila-border/70 rounded-xl flex items-start gap-2.5">
      <span class="material-symbols-outlined text-[20px] text-pastel-lila-ink shrink-0 mt-0.5">info</span>
      <div class="flex flex-col">
        <span class="font-label-md text-label-md text-pastel-lila-ink font-bold">Condiciones de ingreso</span>
        <p class="font-body-sm text-body-sm text-pastel-lila-ink/90">${escapeHtml(reserva.condiciones)}</p>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex items-center gap-2 pt-1">
      <button type="button" id="btn-save-pass" class="flex-1 h-11 rounded-xl bg-ink text-white font-label-md flex items-center justify-center gap-2 hover:bg-ink-body transition-colors cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">file_download</span>
        <span>Guardar en Fotos</span>
      </button>
      <button type="button" data-close-modal class="h-11 px-4 rounded-xl bg-surface-container font-label-md text-ink-body hover:bg-surface-container-high transition-colors cursor-pointer">
        Cerrar
      </button>
    </div>
  `;

  mountModal(html, {
    maxWidthClass: 'sm:max-w-md',
    onMount(root) {
      root.querySelector('#btn-save-pass')?.addEventListener('click', () => {
        showToast('¡Pase digital guardado en tu dispositivo!', {
          subtitle: `Código ${reserva.codigo} listo para mostrar en puerta.`,
          icon: 'download_done'
        });
      });
    }
  });
}

/**
 * Modal 4: Confirmación de Cancelación de Reserva.
 */
export function openCancelConfirmModal(reserva, onConfirmCancel) {
  const html = `
    <div class="flex flex-col items-center text-center gap-3">
      <div class="w-12 h-12 rounded-full bg-pastel-melocoton border border-pastel-melocoton-border flex items-center justify-center text-pastel-melocoton-ink">
        <span class="material-symbols-outlined text-[28px]">warning</span>
      </div>

      <div class="flex flex-col gap-1">
        <h3 class="font-headline-sm text-headline-sm text-ink">¿Deseas cancelar esta reserva?</h3>
        <p class="font-body-md text-body-md text-ink-muted">
          Liberarás el cupo de <strong class="text-ink">${escapeHtml(reserva.titulo)} (${escapeHtml(reserva.codigo)})</strong> para otros compañeros de facultad.
        </p>
      </div>

      <div class="flex flex-col w-full gap-2 mt-2">
        <button type="button" id="btn-confirm-cancel" class="w-full h-11 rounded-xl bg-error text-white font-label-md flex items-center justify-center gap-1.5 hover:bg-on-error-container transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Sí, cancelar reserva</span>
        </button>
        <button type="button" data-close-modal class="w-full h-11 rounded-xl bg-surface-container text-ink-body font-label-md hover:bg-surface-container-high transition-colors cursor-pointer">
          No cancelar, mantener cupo
        </button>
      </div>
    </div>
  `;

  mountModal(html, {
    maxWidthClass: 'sm:max-w-sm',
    onMount(root) {
      root.querySelector('#btn-confirm-cancel')?.addEventListener('click', () => {
        closeModal();
        onConfirmCancel(reserva.id);
      });
    }
  });
}

/**
 * Modal 5: Bandeja rápida de notificaciones.
 */
export function openNotificationsModal(notificaciones, onMarkAllRead) {
  const itemsHtml = notificaciones
    .map((n) => {
      const dotColor =
        n.tipo === 'menta'
          ? 'bg-pastel-menta-dot'
          : n.tipo === 'melocoton'
            ? 'bg-pastel-melocoton-dot'
            : 'bg-secondary';

      return `
        <div class="p-3 rounded-xl border ${
          n.leida ? 'bg-surface-container-low/60 border-ink/5' : 'bg-white border-pastel-lila-border/80 shadow-xs'
        } flex items-start gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full ${dotColor} mt-1.5 shrink-0"></span>
          <div class="flex flex-col gap-0.5 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span class="font-label-md text-ink font-semibold">${escapeHtml(n.titulo)}</span>
              <span class="font-label-sm text-[10px] text-ink-muted shrink-0">${escapeHtml(n.tiempo)}</span>
            </div>
            <p class="font-body-sm text-ink-muted">${escapeHtml(n.detalle)}</p>
          </div>
        </div>
      `;
    })
    .join('');

  const html = `
    <div class="flex items-center justify-between pb-2 border-b border-surface-container">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-secondary text-[22px]">notifications_active</span>
        <h3 class="font-headline-sm text-headline-sm text-ink">Notificaciones</h3>
      </div>
      <button type="button" data-close-modal aria-label="Cerrar notificaciones" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>

    <div class="flex flex-col gap-2">
      ${itemsHtml}
    </div>

    <div class="flex items-center justify-between gap-2 pt-1">
      <button type="button" id="btn-mark-read" class="px-3.5 h-10 rounded-xl bg-pastel-lila text-pastel-lila-ink font-label-md hover:opacity-90 transition-opacity cursor-pointer">
        Marcar todas como leídas
      </button>
      <button type="button" data-close-modal class="px-4 h-10 rounded-xl bg-surface-container text-ink font-label-md hover:bg-surface-container-high cursor-pointer">
        Cerrar
      </button>
    </div>
  `;

  mountModal(html, {
    maxWidthClass: 'sm:max-w-md',
    onMount(root) {
      root.querySelector('#btn-mark-read')?.addEventListener('click', () => {
        onMarkAllRead();
        closeModal();
        showToast('Notificaciones marcadas como leídas', { icon: 'done_all', tone: 'info' });
      });
    }
  });
}

/**
 * Modal 6: Perfil del estudiante y reinicio de datos de demostración.
 */
export function openProfileModal(estudiante, stats, onResetDemo) {
  const html = `
    <div class="flex items-center justify-between pb-2 border-b border-surface-container">
      <h3 class="font-headline-sm text-headline-sm text-ink">Perfil Estudiantil</h3>
      <button type="button" data-close-modal aria-label="Cerrar perfil" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>

    <div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-surface-container-low">
      <div class="w-14 h-14 rounded-2xl bg-pastel-lila border border-pastel-lila-border text-pastel-lila-ink font-headline-md font-extrabold flex items-center justify-center shrink-0">
        ${escapeHtml(estudiante.iniciales)}
      </div>
      <div class="flex flex-col min-w-0">
        <span class="font-headline-sm text-ink truncate">${escapeHtml(estudiante.nombreCompleto)}</span>
        <span class="font-body-sm text-ink-muted truncate">${escapeHtml(estudiante.programa)}</span>
        <span class="font-label-sm text-secondary mt-0.5 font-mono">${escapeHtml(estudiante.codigo)} • ${escapeHtml(estudiante.semestre)}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2.5">
      <div class="p-3 rounded-xl bg-pastel-menta/60 border border-pastel-menta-border/70">
        <span class="font-label-sm text-pastel-menta-ink uppercase">Reservas activas</span>
        <p class="font-headline-md text-ink font-extrabold mt-0.5 tabular-nums">${stats.totalActivas}</p>
      </div>
      <div class="p-3 rounded-xl bg-pastel-cielo/60 border border-pastel-cielo-border/70">
        <span class="font-label-sm text-pastel-cielo-ink uppercase">Correo campus</span>
        <p class="font-label-md text-ink mt-1 truncate">${escapeHtml(estudiante.correo)}</p>
      </div>
    </div>

    <div class="flex flex-col gap-2 pt-1">
      <button type="button" id="btn-reset-demo" class="w-full h-10 rounded-xl bg-pastel-melocoton border border-pastel-melocoton-border text-pastel-melocoton-ink font-label-md flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">restart_alt</span>
        <span>Restaurar datos simulados iniciales</span>
      </button>
      <button type="button" data-close-modal class="w-full h-10 rounded-xl bg-ink text-white font-label-md hover:bg-ink-body transition-colors cursor-pointer">
        Cerrar
      </button>
    </div>
  `;

  mountModal(html, {
    maxWidthClass: 'sm:max-w-sm',
    onMount(root) {
      root.querySelector('#btn-reset-demo')?.addEventListener('click', () => {
        onResetDemo();
        closeModal();
        showToast('Datos de demostración restaurados', { icon: 'restart_alt', tone: 'info' });
      });
    }
  });
}

