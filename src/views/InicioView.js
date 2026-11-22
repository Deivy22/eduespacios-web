/**
 * Vista Principal: "Inicio"
 * Panel de bienvenida personalizado, métricas clave, accesos Bento
 * y listado dinámico de próximas actividades.
 */
import { escapeHtml, renderStatusBadge } from '../components/StatusBadge.js';
import {
  renderStatCard,
  renderBentoServiceCard,
  renderActivityCard,
  renderEmptyState,
  renderTipBanner
} from '../components/Card.js';

export function renderInicioView(state, store) {
  const { estudiante } = state;
  const stats = store.getStats();
  const proximas = store.getActiveReservations().slice(0, 3);

  const actividadesHtml = proximas.length
    ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
         ${proximas.map((r) => renderActivityCard(r)).join('')}
       </div>`
    : renderEmptyState({
        icon: 'event_available',
        title: 'Tu agenda está libre por ahora',
        description: 'Explora las tutorías docentes o reserva un puesto de laboratorio para organizar tu semana.',
        actionLabel: 'Explorar Tutorías',
        actionName: 'go-tutorias'
      });

  return `
    <div class="flex flex-col w-full gap-space-lg animate-view-in">
      <!-- Saludo de bienvenida personalizado -->
      <section class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          ${renderStatusBadge('lila', estudiante.estadoMatricula, { pulse: true, extraClass: 'uppercase tracking-wider' })}
          <span class="font-label-md text-label-md text-ink-muted flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">calendar_today</span>
            <span>${escapeHtml(estudiante.fechaActualLabel)}</span>
          </span>
        </div>

        <div class="mt-1">
          <h2 class="font-headline-lg text-headline-lg text-ink tracking-tight">
            ¡Hola, ${escapeHtml(estudiante.nombre)}! 👋
          </h2>
          <p class="font-body-md text-body-md text-ink-muted mt-0.5">
            ${escapeHtml(estudiante.semestre)} • ${escapeHtml(estudiante.programa)}
          </p>
        </div>
      </section>

      <!-- Métricas y resumen rápido -->
      <section aria-label="Resumen académico" class="grid grid-cols-3 gap-2.5 sm:gap-4">
        ${renderStatCard({
          icon: 'bookmark_added',
          iconColorClass: 'text-secondary',
          topLabel: 'Activas',
          value: String(stats.totalActivas),
          subtitle: 'Reservas',
          targetRoute: 'mis-reservas'
        })}
        ${renderStatCard({
          icon: 'schedule',
          iconColorClass: 'text-pastel-menta-ink',
          topLabel: 'Esta sem.',
          value: String(stats.horasEstudio),
          unit: 'h',
          subtitle: 'De estudio'
        })}
        ${renderStatCard({
          icon: 'alarm',
          iconColorClass: 'text-ink',
          showDot: true,
          value: stats.proximaCita,
          subtitle: 'Próxima cita',
          elevated: true,
          targetRoute: 'mis-reservas'
        })}
      </section>

      <!-- Tarjetas Bento de Servicios Principales -->
      <section class="flex flex-col gap-space-md">
        <div class="flex items-center justify-between">
          <h3 class="font-headline-sm text-headline-sm text-ink">Servicios Principales</h3>
          <span class="font-label-sm text-label-sm text-secondary font-bold tracking-wide uppercase">
            Rápido acceso
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          ${renderBentoServiceCard({
            id: 'card-tutorias',
            variant: 'lila',
            icon: 'school',
            badgeText: `${stats.cuposTutorias} cupos disponibles`,
            title: 'Gestionar Tutorías',
            description: 'Reserva asesoría personalizada presencial o remota con tus docentes de carrera.',
            ctaLabel: 'Explorar Tutorías',
            targetRoute: 'tutorias'
          })}

          ${renderBentoServiceCard({
            id: 'card-laboratorios',
            variant: 'menta',
            icon: 'biotech',
            badgeText: `${stats.labsConCupo} labs con cupo`,
            title: 'Reservar Laboratorios',
            description: 'Puestos de cómputo avanzado, simulación, electrónica, física y robótica.',
            ctaLabel: 'Ver Disponibilidad',
            targetRoute: 'laboratorios'
          })}
        </div>
      </section>

      <!-- Próximas Actividades -->
      <section class="flex flex-col gap-space-md">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-headline-sm text-headline-sm text-ink">Próximas Actividades</h3>
            <span class="min-w-[22px] h-5 px-1.5 rounded-full bg-surface-container-high text-ink font-label-sm tabular-nums flex items-center justify-center">
              ${proximas.length}
            </span>
          </div>
          <button
            type="button"
            data-nav-route="mis-reservas"
            class="font-label-md text-label-md text-secondary font-bold hover:underline cursor-pointer"
          >
            Ver todas
          </button>
        </div>

        ${actividadesHtml}
      </section>

      <!-- Consejo de asistencia -->
      ${renderTipBanner({
        icon: 'lightbulb',
        title: 'Consejo de asistencia',
        textHtml:
          'Recuerda liberar puestos de laboratorio con al menos <strong class="text-ink">1 hora de anticipación</strong> si no vas a utilizarlos para permitir el acceso a otros compañeros.',
        variant: 'lila'
      })}
    </div>
  `;
}

export function bindInicioEvents(container, { navigate }) {
  container.querySelector('[data-action="go-tutorias"]')?.addEventListener('click', () => {
    navigate('tutorias');
  });
}

