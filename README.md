# EduEspacios (`eduespacios-web`)

> Plataforma web interactiva en español para la **gestión de tutorías académicas** y la **reserva de laboratorios universitarios**, diseñada bajo principios de **Interfaz Hombre-Máquina (HCI / IHM)** con estética pastel de alto contraste y arquitectura modular sin dependencias de compilación.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES_Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=0F172A)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Accesibilidad](https://img.shields.io/badge/Contraste-WCAG_AA%2FAAA-065F46?style=flat-square)
![Despliegue](https://img.shields.io/badge/Deploy-GitHub_Pages_%7C_Vercel-0F172A?style=flat-square)

---

## Demostración en vivo

- **Repositorio:** [github.com/Deivy22/eduespacios-web](https://github.com/Deivy22/eduespacios-web)
- **GitHub Pages:** [https://deivy22.github.io/eduespacios-web/](https://deivy22.github.io/eduespacios-web/) *(habilitar en Settings → Pages → `main` / `root`)*
- **Vercel (opcional):** `https://eduespacios-web.vercel.app/`

---

## Propósito desde el enfoque de Diseño de Interfaz Hombre-Máquina (HCI) y Usabilidad

Los portales universitarios tradicionales suelen presentar alta densidad informativa, baja jerarquía visual y flujos fragmentados que aumentan la fricción durante semanas de exámenes o entregas de laboratorio. **EduEspacios** aborda este problema aplicando principios clave de **HCI / Usabilidad**:

- **Reducción de la carga cognitiva:** lienzo cálido en marfil (`#FBF9F6`), agrupación por tarjetas táctiles y revelación progresiva de detalles (resumen rápido en *Inicio*, configuración guiada en *Laboratorios* y detalles/QR bajo demanda en modales).
- **Visibilidad del estado del sistema:** indicadores vivos de cupos, insignias semánticas por estado (*Confirmada*, *Pendiente*, *Cancelada*, *Tu reserva*), contadores sincronizados en navegación y notificaciones flotantes (`Toast`) tras cada acción.
- **Prevención y recuperación ante errores:** validación de formularios en dominio (tema de consulta y motivo de práctica), detección automática de conflictos horarios, confirmación explícita antes de cancelar, liberación automática del cupo/franja al cancelar y botón de **restablecimiento de datos de prueba** en un clic.
- **Accesibilidad e inclusión:** anillos de foco de alto contraste (`:focus-visible`), atributos semánticos ARIA (`aria-current`, `aria-pressed`, `role="dialog"`, `aria-live`), cierre de modales con tecla `Escape`, cifras tabulares (`tabular-nums`) para horarios/códigos y diseño responsivo *mobile-first* con áreas seguras (`env(safe-area-inset-*)`).

---

## Decisiones de Diseño Visual (Paleta Pastel + Alto Contraste)

La identidad visual combina una base serena en tonos marfil y pastel semánticos con tipografías oscuras saturadas para asegurar legibilidad estricta conforme a **WCAG AA / AAA**:

| Rol Semántico | Fondo (Pastel / Superficie) | Texto (Alto Contraste) | Contraste aprox. | Uso en la interfaz |
| :--- | :--- | :--- | :---: | :--- |
| **Lienzo y Tinta Principal** | `#FBF9F6` (Marfil cálido) | `#0F172A` (Azul marino profundo) | **17.4 : 1** (AAA) | Fondo general, encabezados y CTAs primarios |
| **Lila Suave** | `#EADBFF` | `#4C1D95` | **8.9 : 1** (AAA) | Tutorías académicas, avatares docentes y reservas propias |
| **Menta Fresca** | `#D4F3E6` | `#065F46` | **6.9 : 1** (AA+/AAA) | Laboratorios libres, franjas disponibles y estado *Confirmada* |
| **Azul Cielo** | `#D9EDFF` | `#075985` | **6.7 : 1** (AA+) | Estaciones asignadas y recursos de cómputo/multimedia |
| **Melocotón Sutil** | `#FFEAD8` | `#9A3412` | **6.5 : 1** (AA+) | Estado *Pendiente*, últimos cupos y avisos de normativa |
| **Rosa / Error Pastel** | `#FFDAD6` | `#93000A` | **7.1 : 1** (AAA) | Estado *Cancelada* y alertas de validación |

- **Tipografía:** `Plus Jakarta Sans` (pesos 400–800) combinada con `Material Symbols Outlined` para iconografía consistente.
- **Elevación suave:** superficies estratificadas con bordes de baja opacidad (`rgba(15, 23, 42, 0.07)`) y sombras difusas sin ruido visual.

---

## Arquitectura Modular del Proyecto

El proyecto separa de forma explícita presentación, componentes reutilizables, vistas, datos simulados, reglas de negocio y gestión de estado mediante **ES Modules nativos**:

```text
eduespacios-web/
├── .gitignore                        # Exclusiones de SO, editores, logs y cachés
├── index.html                        # Punto de entrada SPA y montaje de portales
├── README.md                         # Documentación técnica y guía de despliegue
└── src/
    ├── main.js                       # Arranque, enrutador (#hash) y delegación global
    ├── styles/                       # 1) Tema pastel y estilos base
    │   ├── tailwind-theme.js         # Tokens centralizados (colores pastel, tipografía, espaciado)
    │   ├── theme.css                 # Variables CSS semánticas, glassmorphism y elevaciones
    │   └── base.css                  # Resets, accesibilidad, tabular-nums y animaciones
    ├── components/                   # 2) Componentes UI reutilizables
    │   ├── Navbar.js                 # Cabecera responsiva (escritorio) + barra inferior (móvil)
    │   ├── StatusBadge.js            # Insignias semánticas pastel y chips de cupos
    │   ├── Card.js                   # Tarjetas KPI, Bento, Tutorías, Reservas, Banners y EmptyState
    │   ├── Modal.js                  # Modales (Solicitud, Voucher, Detalle/QR, Cancelación, Perfil)
    │   └── Toast.js                  # Sistema unificado de notificaciones flotantes
    ├── views/                        # 3) Vistas principales
    │   ├── InicioView.js             # Panel de bienvenida, KPIs, accesos Bento y próximas citas
    │   ├── TutoriasView.js           # Búsqueda, filtros combinados y reserva de franjas
    │   ├── LaboratoriosView.js       # Calendario semanal, turnos, matriz por fecha y resumen
    │   └── MisReservasView.js        # Gestión por pestañas, pase QR y cancelación/retiro
    ├── data/                         # 4) Datos iniciales simulados (Mock Data)
    │   └── mockData.js               # Estudiante, tutorías, 4 laboratorios, calendario y reservas
    ├── services/                     # 5) Lógica de negocio y reglas de dominio
    │   ├── tutoriasService.js        # Filtros, validación de consultas y conflictos de tutorías
    │   ├── laboratoriosService.js    # Disponibilidad por fecha/turno, conflictos y vouchers
    │   └── reservasService.js        # Filtros por categoría, cancelación/retiro y cálculo de KPIs
    └── state/                        # 6) Capa de estado centralizada
        └── store.js                  # Store Pub/Sub delgado con persistencia en localStorage
```

---

## Funcionalidades Interactivas Implementadas

- **Inicio:** saludo personalizado, métricas académicas actualizadas en tiempo real, tarjetas de acceso rápido Bento hacia *Tutorías Académicas* y *Reserva de Laboratorios*, listado de próximas actividades con acceso a ficha/QR, centro de notificaciones y modal de perfil.
- **Tutorías Académicas:** búsqueda instantánea, filtros combinados por **Asignatura**, **Turno** y **Docente**, selector previo de franja de 30 minutos directamente en cada tarjeta, modal **Confirmar Solicitud** precargado con la franja elegida, validación del tema de consulta, detección de conflictos horarios y actualización inmediata de cupos.
- **Reserva de Laboratorios:** conmutador entre 4 laboratorios con estaciones y especificaciones propias, tira semanal de fechas navegable, turnos (*Mañana*, *Tarde*, *Noche*), filtro *"Solo con cupo"*, cuadrícula de disponibilidad **por fecha y turno**, panel **Resumen de Reserva** reactivo, validación obligatoria de *"Motivo de práctica"*, equipamiento opcional y emisión de voucher digital (`#LAB-XXXX`).
- **Mis Reservas:** pestañas dinámicas (*Todas*, *Tutorías*, *Laboratorios*) con contadores vivos, modal **Detalle y Pase Digital QR** con información completa, flujo de **Cancelación** con confirmación que **libera automáticamente el cupo o la celda de laboratorio**, opción de retirar reservas canceladas y botón **Restablecer demo**.
- **Persistencia local:** estado guardado automáticamente en memoria y `localStorage`, permitiendo recargar el navegador sin perder reservas ni cupos modificados.

---

## Ejecución Local (Paso a Paso)

Debido al uso de **ES Modules nativos** (`<script type="module">`), el proyecto debe servirse a través de un servidor HTTP local (no requiere `npm install` ni proceso de build).

### Opción 1: Con VS Code y Live Server
1. Clona o descarga el repositorio y ábrelo en **Visual Studio Code**.
2. Instala la extensión **Live Server** (si no la tienes).
3. Haz clic derecho sobre `index.html` y elige **Open with Live Server**.

### Opción 2: Con Python (servidor HTTP simple)
1. Abre una terminal en la carpeta raíz del proyecto (`eduespacios-web/`).
2. Ejecuta:
   ```bash
   python -m http.server 8000
   ```
3. Abre en tu navegador: `http://localhost:8000`

### Opción 3: Con Node.js (opcional)
```bash
npx serve .
```

---

## Despliegue en GitHub Pages o Vercel

El proyecto utiliza **rutas relativas limpias (`./src/...`)** y **enrutamiento por `#hash`**, por lo que funciona sin configuración adicional tanto en la raíz de un dominio como en subrutas (`/eduespacios-web/`):

- **GitHub Pages:** en el repositorio de GitHub ve a **Settings → Pages → Build and deployment**, selecciona **Deploy from a branch**, elige `main` y carpeta `/ (root)` y guarda.
- **Vercel:** importa el repositorio en [vercel.com](https://vercel.com), deja el preset en **Other / Static** (sin comando de build, directorio de salida `.`) y haz clic en **Deploy**.
