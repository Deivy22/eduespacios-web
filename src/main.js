/**
 * Punto de entrada principal (SPA) de EduEspacios.
 * Conecta el enrutador por hash (#inicio, #tutorias, #laboratorios, #mis-reservas),
 * el estado centralizado, la navegación y los modales globales.
 */
import { store } from './state/store.js';
import { renderHeader, renderBottomNav } from './components/Navbar.js';
import {
  openBookingTutoriaModal,
  openQrPassModal,
  openCancelConfirmModal,
  openNotificationsModal,
  openProfileModal
} from './components/Modal.js';
import { showToast } from './components/Toast.js';

import { renderInicioView, bindInicioEvents } from './views/InicioView.js';
import { renderTutoriasView, bindTutoriasEvents } from './views/TutoriasView.js';
import { renderLaboratoriosView, bindLaboratoriosEvents } from './views/LaboratoriosView.js';
import { renderMisReservasView, bindMisReservasEvents } from './views/MisReservasView.js';

const VIEWS = {
  inicio: { render: renderInicioView, bind: bindInicioEvents, title: 'Inicio' },
  tutorias: { render: renderTutoriasView, bind: bindTutoriasEvents, title: 'Tutorías Académicas' },
  laboratorios: { render: renderLaboratoriosView, bind: bindLaboratoriosEvents, title: 'Reserva de Laboratorios' },
  'mis-reservas': { render: renderMisReservasView, bind: bindMisReservasEvents, title: 'Mis Reservas' }
};

function getRouteFromHash() {
  const clean = window.location.hash.replace(/^#\/?/, '').trim();
  return VIEWS[clean] ? clean : 'inicio';
}

function navigate(route) {
  const target = VIEWS[route] ? route : 'inicio';
  if (window.location.hash !== `#${target}`) {
    window.location.hash = `#${target}`;
  } else {
    store.setRoute(target);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderApp(state) {
  const headerEl = document.getElementById('app-header');
  const mainEl = document.getElementById('app-main');
  const bottomNavEl = document.getElementById('app-bottom-nav');

  const stats = store.getStats();
  const activeView = VIEWS[state.route] || VIEWS.inicio;

  document.title = `${activeView.title} — EduEspacios`;

  if (headerEl) {
    headerEl.innerHTML = renderHeader({
      currentRoute: state.route,
      estudiante: state.estudiante,
      stats
    });
  }

  if (bottomNavEl) {
    bottomNavEl.innerHTML = renderBottomNav({
      currentRoute: state.route,
      stats
    });
  }

  if (mainEl) {
    mainEl.innerHTML = activeView.render(state, store);
    activeView.bind(mainEl, { store, navigate });
  }
}

/**
 * Delegación global para navegación y acciones transversales (modales compartidos).
 */
function setupGlobalListeners() {
  document.addEventListener('click', (event) => {
    // 1. Enlaces y botones de navegación entre vistas
    const navTrigger = event.target.closest('[data-nav-route]');
    if (navTrigger) {
      event.preventDefault();
      navigate(navTrigger.getAttribute('data-nav-route'));
      return;
    }

    // 2. Acciones globales mediante data-action
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action');
    const state = store.getState();

    switch (action) {
      case 'open-notifications': {
        openNotificationsModal(state.estudiante.notificaciones, () => {
          store.markNotificationsRead();
        });
        break;
      }

      case 'open-profile': {
        openProfileModal(state.estudiante, store.getStats(), () => {
          store.resetDemoData();
        });
        break;
      }

      case 'open-qr-pass': {
        const reservaId = actionEl.getAttribute('data-reserva-id');
        const reserva = state.reservas.find((r) => r.id === reservaId);
        if (reserva) openQrPassModal(reserva);
        break;
      }

      case 'prompt-cancel-reserva': {
        const reservaId = actionEl.getAttribute('data-reserva-id');
        const reserva = state.reservas.find((r) => r.id === reservaId);
        if (reserva) {
          openCancelConfirmModal(reserva, (id) => {
            if (store.cancelarReserva(id)) {
              showToast('Reserva cancelada correctamente', {
                subtitle: 'El cupo y horario fueron liberados automáticamente.',
                icon: 'check_circle',
                tone: 'success'
              });
            }
          });
        }
        break;
      }

      case 'remove-cancelled-reserva': {
        const reservaId = actionEl.getAttribute('data-reserva-id');
        if (store.retirarReservaCancelada(reservaId)) {
          showToast('Reserva cancelada retirada de tu listado', {
            icon: 'delete_outline',
            tone: 'info'
          });
        }
        break;
      }

      case 'reset-demo-data': {
        store.resetDemoData();
        showToast('Datos de prueba restablecidos', {
          subtitle: 'Se restauraron cupos, horarios y reservas iniciales.',
          icon: 'restart_alt',
          tone: 'info'
        });
        break;
      }

      case 'select-tutoria-slot': {
        const tutoriaId = actionEl.getAttribute('data-tutoria-id');
        const franja = actionEl.getAttribute('data-franja');
        if (tutoriaId && franja) {
          store.selectTutoriaSlot(tutoriaId, franja);
        }
        break;
      }

      case 'open-tutoria-modal': {
        const tutoriaId = actionEl.getAttribute('data-tutoria-id');
        const tutoria = state.tutorias.find((t) => t.id === tutoriaId);
        const franjaPrecargada = store.getSelectedTutoriaSlot(tutoriaId);
        if (tutoria && tutoria.cupos > 0) {
          openBookingTutoriaModal(tutoria, franjaPrecargada, (payload) => {
            const resultado = store.reservarTutoria(payload);
            if (resultado.ok) {
              showToast('¡Solicitud de tutoría confirmada!', {
                subtitle: `Código ${resultado.data.codigo} agregado a Mis Reservas.`,
                icon: 'school',
                tone: 'success'
              });
            }
            return resultado;
          });
        }
        break;
      }

      default:
        break;
    }
  });

  window.addEventListener('hashchange', () => {
    store.setRoute(getRouteFromHash());
  });
}

// Arranque inicial de la aplicación
function bootstrap() {
  setupGlobalListeners();
  store.subscribe(renderApp);

  const initialRoute = getRouteFromHash();
  store.state.route = initialRoute;
  renderApp(store.getState());
}

bootstrap();

