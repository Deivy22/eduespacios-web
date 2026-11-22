/**
 * Datos iniciales simulados (Mock Data) para el prototipo interactivo EduEspacios.
 * Centraliza el perfil estudiantil, catálogo de tutorías, matriz de laboratorios,
 * calendario semanal y reservas iniciales.
 */

export const ESTUDIANTE_ACTUAL = {
  nombre: 'Sofía',
  nombreCompleto: 'Sofía Martínez Herrera',
  iniciales: 'SM',
  codigo: 'EST-2025-0418',
  correo: 'sofia.martinez@campus.edu',
  semestre: 'Semestre 2025-1',
  programa: 'Grado en Ingeniería Informática',
  estadoMatricula: 'Matrícula al día',
  fechaActualLabel: '22 Octubre',
  horasEstudioSemana: 8,
  notificaciones: [
    {
      id: 'notif-1',
      titulo: 'Recordatorio de tutoría hoy',
      detalle: 'Estructuras de Datos con Dr. Carlos Mendoza a las 16:00 en Cubículo 302B.',
      tiempo: 'Hace 20 min',
      tipo: 'lila',
      leida: false
    },
    {
      id: 'notif-2',
      titulo: 'Puesto de laboratorio confirmado',
      detalle: 'Tu estación PC-04 en Lab. de Cómputo Avanzado está lista para hoy a las 17:00.',
      tiempo: 'Hace 2 horas',
      tipo: 'menta',
      leida: false
    },
    {
      id: 'notif-3',
      titulo: 'Solicitud en revisión',
      detalle: 'El coordinador revisará tu acceso al Banco de óptica 2 antes del viernes.',
      tiempo: 'Ayer',
      tipo: 'melocoton',
      leida: true
    }
  ]
};

export const ASIGNATURAS_FILTRO = [
  { id: 'all', label: 'Todas' },
  { id: 'algoritmos', label: 'Algoritmos y Estructuras' },
  { id: 'calculo', label: 'Cálculo Diferencial' },
  { id: 'sistemas', label: 'Sistemas Operativos' },
  { id: 'fisica', label: 'Física II' }
];

export const TURNOS_FILTRO = [
  { id: 'todos', label: 'Cualquier franja' },
  { id: 'manana', label: 'Mañana (8:00 - 12:00)' },
  { id: 'tarde', label: 'Tarde (12:00 - 18:00)' },
  { id: 'noche', label: 'Noche (18:00+)' }
];

export const DOCENTES_FILTRO = [
  { id: 'todos', label: 'Todos los docentes' },
  { id: 'carlos', label: 'Dr. Carlos Mendoza' },
  { id: 'elena', label: 'Dra. Elena Ruiz' },
  { id: 'roberto', label: 'Prof. Roberto Gómez' },
  { id: 'andrea', label: 'Prof. Andrea Valenzuela' }
];

export const TUTORIAS_INICIALES = [
  {
    id: 'tut-algoritmos',
    asignatura: 'Algoritmos y Complejidad',
    subjectKey: 'algoritmos',
    docenteKey: 'carlos',
    docente: 'Dr. Carlos Mendoza',
    iniciales: 'CM',
    especialidad: 'IA & Grafos',
    avatarTema: 'lila',
    turno: 'tarde',
    horarioCorto: 'Mié, 15:00 - 16:30',
    horarioCompleto: 'Miércoles 25 Octubre • 15:00 - 16:30',
    modalidadIcono: 'location_on',
    modalidadTexto: 'Presencial • Despacho 412',
    ubicacionDetalle: 'Despacho 412 (Edificio Central)',
    etiquetaDuracion: 'Bloques de 30 min',
    iconoDuracion: 'timer',
    cupos: 2,
    franjas: ['15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30'],
    recomendacion: 'Traer enunciados o repositorio del laboratorio actual para revisión directa.'
  },
  {
    id: 'tut-calculo',
    asignatura: 'Cálculo Multivariable y Álgebra',
    subjectKey: 'calculo',
    docenteKey: 'elena',
    docente: 'Dra. Elena Ruiz',
    iniciales: 'ER',
    especialidad: 'Dpto. Matemáticas',
    avatarTema: 'cielo',
    turno: 'manana',
    horarioCorto: 'Jue, 09:00 - 10:30',
    horarioCompleto: 'Jueves 26 Octubre • 09:00 - 10:30',
    modalidadIcono: 'videocam',
    modalidadTexto: 'Virtual • Google Meet',
    ubicacionDetalle: 'Sesión Virtual (Google Meet)',
    etiquetaDuracion: 'Sesión 1 a 1',
    iconoDuracion: 'group',
    cupos: 1,
    franjas: ['09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30'],
    recomendacion: 'Enlace de conexión Meet activo 10 minutos antes del inicio.'
  },
  {
    id: 'tut-arquitectura',
    asignatura: 'Arquitectura de Computadores',
    subjectKey: 'sistemas',
    docenteKey: 'roberto',
    docente: 'Prof. Roberto Gómez',
    iniciales: 'RG',
    especialidad: 'Hardware & IoT',
    avatarTema: 'menta',
    turno: 'tarde',
    horarioCorto: 'Vie, 16:00 - 17:30',
    horarioCompleto: 'Viernes 27 Octubre • 16:00 - 17:30',
    modalidadIcono: 'devices',
    modalidadTexto: 'Híbrida • Lab Hardware 2',
    ubicacionDetalle: 'Híbrida (Lab Hardware 2 / Meet)',
    etiquetaDuracion: 'Equipos disponibles',
    iconoDuracion: 'devices_other',
    cupos: 4,
    franjas: ['16:00 - 16:30', '16:30 - 17:00', '17:00 - 17:30'],
    recomendacion: 'Equipos osciloscopio y placas RISC-V disponibles durante la asesoría.'
  },
  {
    id: 'tut-fisica',
    asignatura: 'Física II: Electromagnetismo',
    subjectKey: 'fisica',
    docenteKey: 'andrea',
    docente: 'Prof. Andrea Valenzuela',
    iniciales: 'AV',
    especialidad: 'Física Aplicada',
    avatarTema: 'melocoton',
    turno: 'noche',
    horarioCorto: 'Lun, 18:30 - 20:00',
    horarioCompleto: 'Lunes 30 Octubre • 18:30 - 20:00',
    modalidadIcono: 'videocam',
    modalidadTexto: 'Virtual • Aula B-4 (Teams)',
    ubicacionDetalle: 'Aula Virtual B-4 (Microsoft Teams)',
    etiquetaDuracion: 'Resolución guiada',
    iconoDuracion: 'calculate',
    cupos: 3,
    franjas: ['18:30 - 19:00', '19:00 - 19:30', '19:30 - 20:00'],
    recomendacion: 'Compartir dudas de la guía de ejercicios #4 en el formulario.'
  }
];

export const SEMANAS_CALENDARIO = [
  {
    mesLabel: 'Octubre 2025',
    dias: [
      { id: '2025-10-21', corto: 'Lun', numero: '21', completo: 'Lunes, 21 de Octubre', indicador: 'neutral' },
      { id: '2025-10-22', corto: 'Mar', numero: '22', completo: 'Martes, 22 de Octubre', indicador: 'secondary' },
      { id: '2025-10-23', corto: 'Mié', numero: '23', completo: 'Miércoles, 23 de Octubre', indicador: 'menta' },
      { id: '2025-10-24', corto: 'Jue', numero: '24', completo: 'Jueves, 24 de Octubre', indicador: 'neutral' },
      { id: '2025-10-25', corto: 'Vie', numero: '25', completo: 'Viernes, 25 de Octubre', indicador: 'secondary' }
    ]
  },
  {
    mesLabel: 'Octubre / Noviembre 2025',
    dias: [
      { id: '2025-10-28', corto: 'Lun', numero: '28', completo: 'Lunes, 28 de Octubre', indicador: 'menta' },
      { id: '2025-10-29', corto: 'Mar', numero: '29', completo: 'Martes, 29 de Octubre', indicador: 'secondary' },
      { id: '2025-10-30', corto: 'Mié', numero: '30', completo: 'Miércoles, 30 de Octubre', indicador: 'menta' },
      { id: '2025-10-31', corto: 'Jue', numero: '31', completo: 'Jueves, 31 de Octubre', indicador: 'neutral' },
      { id: '2025-11-01', corto: 'Vie', numero: '01', completo: 'Viernes, 01 de Noviembre', indicador: 'secondary' }
    ]
  }
];

export const TURNOS_LAB = [
  {
    id: 'Mañana',
    label: 'Mañana',
    horarios: [
      { corta: '08:00', rango: '08:00 - 09:00 hrs' },
      { corta: '09:00', rango: '09:00 - 10:00 hrs' },
      { corta: '10:00', rango: '10:00 - 11:00 hrs' },
      { corta: '11:00', rango: '11:00 - 12:00 hrs' }
    ]
  },
  {
    id: 'Tarde',
    label: 'Tarde',
    horarios: [
      { corta: '09:00', rango: '09:00 - 10:00 hrs' },
      { corta: '10:00', rango: '10:00 - 11:00 hrs' },
      { corta: '11:00', rango: '11:00 - 12:00 hrs' },
      { corta: '14:00', rango: '14:00 - 15:00 hrs' }
    ]
  },
  {
    id: 'Noche',
    label: 'Noche',
    horarios: [
      { corta: '17:00', rango: '17:00 - 18:00 hrs' },
      { corta: '18:00', rango: '18:00 - 19:00 hrs' },
      { corta: '19:00', rango: '19:00 - 20:00 hrs' },
      { corta: '20:00', rango: '20:00 - 21:00 hrs' }
    ]
  }
];

export const LABORATORIOS_INICIALES = [
  {
    id: 'lab-computacion',
    nombre: 'Lab Computación Avanzada',
    icono: 'terminal',
    pabellon: 'Pabellón C • Aulas Nuevas',
    tituloMatriz: 'Estaciones de Trabajo (PC)',
    iconoPuesto: 'computer',
    motivoSugerido: 'Desarrollo de proyecto de Sistemas Distribuidos y Computación Paralela',
    normativa: 'Tolerancia máxima de llegada de 15 minutos con credencial universitaria física o digital EduEspacios.',
    estaciones: [
      {
        id: 'PC-01',
        nombre: 'Puesto PC-01',
        specs: 'i9 / 64GB / RTX 4080',
        ocupados: {
          Mañana: ['08:00', '11:00'],
          Tarde: ['09:00', '14:00'],
          Noche: ['18:00']
        }
      },
      {
        id: 'PC-02',
        nombre: 'Puesto PC-02',
        specs: 'i9 / 128GB / RTX 4090',
        ocupados: {
          Mañana: ['09:00'],
          Tarde: ['10:00'],
          Noche: ['19:00', '20:00']
        }
      },
      {
        id: 'PC-03',
        nombre: 'Puesto PC-03',
        specs: 'i9 / 64GB / Dual Boot Linux',
        ocupados: {
          Mañana: ['10:00'],
          Tarde: ['11:00'],
          Noche: ['17:00']
        }
      },
      {
        id: 'PC-04',
        nombre: 'Puesto PC-04',
        specs: 'Apple Silicon M2 Max / 32GB',
        ocupados: {
          Mañana: ['08:00', '09:00'],
          Tarde: ['09:00', '14:00'],
          Noche: ['18:00', '20:00']
        }
      }
    ],
    equipamientoExtra: [
      { id: 'gpu-4090', nombre: 'Aceleración GPU dedicada RTX 4090', badge: 'Preinstalada', badgeTipo: 'neutral', checked: true },
      { id: 'monitor-4k', nombre: 'Monitor dual 4K IPS para depuración', badge: 'Disponible', badgeTipo: 'menta', checked: true },
      { id: 'kit-esp32', nombre: 'Kit de prototipado rápido Arduino / ESP32', badge: 'En armario B', badgeTipo: 'neutral', checked: false }
    ]
  },
  {
    id: 'lab-robotica',
    nombre: 'Lab Robótica & IA',
    icono: 'smart_toy',
    pabellon: 'Pabellón D • Centro de Innovación',
    tituloMatriz: 'Bancos de Robótica y Visión',
    iconoPuesto: 'precision_manufacturing',
    motivoSugerido: 'Calibración de brazo robótico y pruebas de visión artificial',
    normativa: 'Uso obligatorio de calzado cerrado y registro de instrumental en ventanilla de control.',
    estaciones: [
      {
        id: 'ROB-01',
        nombre: 'Banco ROB-01',
        specs: 'Brazo 6-DOF + Jetson Orin',
        ocupados: { Mañana: ['09:00'], Tarde: ['10:00'], Noche: ['19:00'] }
      },
      {
        id: 'ROB-02',
        nombre: 'Banco ROB-02',
        specs: 'Rover ROS2 + LIDAR 360°',
        ocupados: { Mañana: ['08:00', '10:00'], Tarde: ['14:00'], Noche: ['17:00'] }
      },
      {
        id: 'ROB-03',
        nombre: 'Banco ROB-03',
        specs: 'Cámara Stereo + FPGA Xilinx',
        ocupados: { Mañana: ['11:00'], Tarde: ['09:00', '11:00'], Noche: ['20:00'] }
      },
      {
        id: 'ROB-04',
        nombre: 'Banco ROB-04',
        specs: 'Estación Soldadura y Osciloscopio',
        ocupados: { Mañana: ['09:00'], Tarde: ['10:00'], Noche: ['18:00'] }
      }
    ],
    equipamientoExtra: [
      { id: 'fuente-dc', nombre: 'Fuente de poder regulada 0-30V DC', badge: 'Disponible', badgeTipo: 'menta', checked: true },
      { id: 'lidar-kit', nombre: 'Módulo sensor ultrasonido y giroscopio', badge: 'En armario A', badgeTipo: 'neutral', checked: false }
    ]
  },
  {
    id: 'lab-quimica',
    nombre: 'Lab Química Orgánica',
    icono: 'science',
    pabellon: 'Edificio Ciencias • Planta 2',
    tituloMatriz: 'Mesones Analíticos',
    iconoPuesto: 'science',
    motivoSugerido: 'Práctica de espectrofotometría y síntesis controlada',
    normativa: 'Indispensable bata blanca de algodón, gafas de seguridad y guantes de nitrilo.',
    estaciones: [
      {
        id: 'QUI-01',
        nombre: 'Mesón QUI-01',
        specs: 'Campana de extracción + Balanza',
        ocupados: { Mañana: ['08:00'], Tarde: ['09:00'], Noche: ['18:00', '19:00'] }
      },
      {
        id: 'QUI-02',
        nombre: 'Mesón QUI-02',
        specs: 'Espectrofotómetro UV-Vis',
        ocupados: { Mañana: ['10:00'], Tarde: ['11:00'], Noche: ['17:00'] }
      },
      {
        id: 'QUI-03',
        nombre: 'Mesón QUI-03',
        specs: 'Centrífuga y pH-metro digital',
        ocupados: { Mañana: ['09:00', '11:00'], Tarde: ['14:00'], Noche: ['20:00'] }
      },
      {
        id: 'QUI-04',
        nombre: 'Mesón QUI-04',
        specs: 'Microscopio digital 1000x',
        ocupados: { Mañana: ['08:00'], Tarde: ['10:00'], Noche: ['19:00'] }
      }
    ],
    equipamientoExtra: [
      { id: 'kit-vidrio', nombre: 'Set de cristalería borosilicato calibrada', badge: 'Disponible', badgeTipo: 'menta', checked: true },
      { id: 'gafas-prot', nombre: 'Gafas de protección lateral (préstamo)', badge: 'Ventanilla', badgeTipo: 'neutral', checked: false }
    ]
  },
  {
    id: 'lab-fisica',
    nombre: 'Lab Física Aplicada',
    icono: 'precision_manufacturing',
    pabellon: 'Módulo 105 • Bloque Ciencias',
    tituloMatriz: 'Bancos de Óptica y Mecánica',
    iconoPuesto: 'biotech',
    motivoSugerido: 'Medición interferométrica y análisis de circuitos RLC',
    normativa: 'No ingresar alimentos ni bebidas; calibrar sensores ópticos antes de finalizar.',
    estaciones: [
      {
        id: 'FIS-01',
        nombre: 'Banco Óptica 1',
        specs: 'Láser He-Ne + Banco milimetrado',
        ocupados: { Mañana: ['09:00'], Tarde: ['10:00'], Noche: ['18:00'] }
      },
      {
        id: 'FIS-02',
        nombre: 'Banco Óptica 2',
        specs: 'Interferómetro Michelson + Sensor',
        ocupados: { Mañana: ['08:00', '11:00'], Tarde: ['14:00'], Noche: ['19:00'] }
      },
      {
        id: 'FIS-03',
        nombre: 'Mesa Mecánica 3',
        specs: 'Carril de aire + Fotopuertas USB',
        ocupados: { Mañana: ['10:00'], Tarde: ['09:00'], Noche: ['17:00'] }
      },
      {
        id: 'FIS-04',
        nombre: 'Mesa Eléctrica 4',
        specs: 'Generador funciones + Osciloscopio',
        ocupados: { Mañana: ['09:00'], Tarde: ['11:00'], Noche: ['20:00'] }
      }
    ],
    equipamientoExtra: [
      { id: 'interfaz-usb', nombre: 'Interfaz de captura de datos en tiempo real', badge: 'Disponible', badgeTipo: 'menta', checked: true },
      { id: 'kit-lentes', nombre: 'Caja de prismas y lentes convergentes', badge: 'En armario C', badgeTipo: 'neutral', checked: false }
    ]
  }
];

export const RESERVAS_INICIALES = [
  {
    id: 'RES-8921',
    codigo: '#RES-8921',
    categoria: 'laboratorio',
    etiquetaCategoria: 'Puesto Asignado',
    titulo: 'Laboratorio de Cómputo Avanzado',
    subtitulo: 'Estación PC-04 • Edificio Aulas Nuevas',
    ubicacionCorta: 'Estación PC-04 • Edificio Aulas Nuevas',
    horario: 'Hoy, 17:00 - 19:00',
    horaInicio: '17:00',
    icono: 'science',
    iconoHorario: 'schedule',
    tema: 'cielo',
    estado: 'confirmada',
    accionPrincipalLabel: 'Ver detalle y Pase',
    accionPrincipalIcono: 'qr_code_2',
    accionInicioLabel: 'Ficha',
    accionInicioIcono: 'info',
    condiciones: 'Presentar carné universitario al laboratorista de turno. Tolerancia de 15 min.',
    iniciales: null
  },
  {
    id: 'TUT-4310',
    codigo: '#TUT-4310',
    categoria: 'tutoria',
    etiquetaCategoria: 'Tutoría Individual',
    titulo: 'Estructuras de Datos e IA',
    subtitulo: 'Prof. Dr. Carlos Mendoza • Cubículo 302B',
    ubicacionCorta: 'Cubículo 302B • Edif. Central',
    horario: 'Hoy, 16:00 - 17:00',
    horaInicio: '16:00',
    icono: 'school',
    iconoHorario: 'event',
    tema: 'lila',
    estado: 'confirmada',
    accionPrincipalLabel: 'Ver detalle',
    accionPrincipalIcono: 'badge',
    accionInicioLabel: 'Ver sala',
    accionInicioIcono: 'meeting_room',
    condiciones: 'Llevar avances impresos o en formato digital del proyecto final.',
    iniciales: 'CM'
  },
  {
    id: 'LAB-9042',
    codigo: '#LAB-9042',
    categoria: 'laboratorio',
    etiquetaCategoria: 'Equipo Especializado',
    titulo: 'Laboratorio de Física Experimental',
    subtitulo: 'Banco de óptica 2 • Módulo 105',
    ubicacionCorta: 'Banco de óptica 2 • Módulo 105',
    horario: 'Viernes 25 Oct, 10:00 - 12:00',
    horaInicio: '10:00',
    icono: 'biotech',
    iconoHorario: 'calendar_today',
    tema: 'melocoton',
    estado: 'pendiente',
    accionPrincipalLabel: 'Ver solicitud',
    accionPrincipalIcono: 'visibility',
    accionInicioLabel: 'Ficha',
    accionInicioIcono: 'info',
    condiciones: 'Uso obligatorio de bata blanca y gafas de protección ocular.',
    iniciales: null
  },
  {
    id: 'TUT-5129',
    codigo: '#TUT-5129',
    categoria: 'tutoria',
    etiquetaCategoria: 'Tutoría Temática',
    titulo: 'Sistemas de Bases de Datos',
    subtitulo: 'Dra. Carmen Serrano • Sala Virtual 3',
    ubicacionCorta: 'Sala Virtual 3 (Meet)',
    horario: 'Próximo Lunes, 11:00 - 12:00',
    horaInicio: '11:00',
    icono: 'school',
    iconoHorario: 'videocam',
    tema: 'lila',
    estado: 'confirmada',
    accionPrincipalLabel: 'Ver detalle',
    accionPrincipalIcono: 'laptop_chromebook',
    accionInicioLabel: 'Enlace',
    accionInicioIcono: 'link',
    condiciones: 'Enlace de conexión Meet activo 10 minutos antes del inicio.',
    iniciales: 'CS'
  }
];

