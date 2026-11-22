/**
 * Configuración centralizada de Tailwind CSS para EduEspacios.
 * Unifica los tokens de color pastel, superficies marfil, tipografía Plus Jakarta Sans
 * y escala de espaciado definidos en el sistema de diseño institucional.
 */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Lienzo marfil y superficies tonalizadas
        surface: '#fbf9f6',
        background: '#fbf9f6',
        'surface-bright': '#fbf9f6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3f0',
        'surface-container': '#efeeeb',
        'surface-container-high': '#eae8e5',
        'surface-container-highest': '#e4e2df',
        'surface-variant': '#e4e2df',
        'surface-dim': '#dbdad7',
        'surface-tint': '#565e74',

        // Tipografía y alto contraste (WCAG AAA)
        ink: '#0F172A',
        'ink-body': '#1E293B',
        'ink-muted': '#475569',
        'on-surface': '#1b1c1a',
        'on-background': '#1b1c1a',
        'on-surface-variant': '#45464d',
        'inverse-surface': '#30312f',
        'inverse-on-surface': '#f2f0ed',
        outline: '#76777d',
        'outline-variant': '#c6c6cd',

        // Acentos institucionales
        primary: '#0F172A',
        'on-primary': '#ffffff',
        'primary-container': '#131b2e',
        'on-primary-container': '#7c839b',
        'primary-fixed': '#dae2fd',
        'primary-fixed-dim': '#bec6e0',
        'on-primary-fixed': '#131b2e',
        'on-primary-fixed-variant': '#3f465c',
        'inverse-primary': '#bec6e0',

        secondary: '#4e45d5',
        'on-secondary': '#ffffff',
        'secondary-container': '#6860ef',
        'on-secondary-container': '#fffbff',
        'secondary-fixed': '#e3dfff',
        'secondary-fixed-dim': '#c3c0ff',
        'on-secondary-fixed': '#100069',
        'on-secondary-fixed-variant': '#372abf',

        tertiary: '#000000',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#00201d',
        'on-tertiary-container': '#0c9488',
        'tertiary-fixed': '#89f5e7',
        'tertiary-fixed-dim': '#6bd8cb',
        'on-tertiary-fixed': '#00201d',
        'on-tertiary-fixed-variant': '#005049',

        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Paleta semántica pastel (con texto y borde de alto contraste)
        'pastel-lila': '#EADBFF',
        'pastel-lila-border': '#C4B5FD',
        'pastel-lila-ink': '#4C1D95',

        'pastel-menta': '#D4F3E6',
        'pastel-menta-border': '#A7F3D0',
        'pastel-menta-ink': '#065F46',
        'pastel-menta-dot': '#10B981',

        'pastel-cielo': '#D9EDFF',
        'pastel-cielo-border': '#BAE6FD',
        'pastel-cielo-ink': '#075985',

        'pastel-melocoton': '#FFEAD8',
        'pastel-melocoton-border': '#FED7AA',
        'pastel-melocoton-ink': '#9A3412',
        'pastel-melocoton-dot': '#F59E0B',

        'pastel-rosa': '#FCE7F3',
        'pastel-rosa-border': '#FBCFE8',
        'pastel-rosa-ink': '#9D174D'
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        full: '9999px'
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        gutter: '1.25rem',
        'gutter-desktop': '1.75rem',
        margin: '1rem',
        'margin-tablet': '2rem',
        'margin-desktop': '3rem'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'display-lg': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'display-lg-mobile': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'headline-lg': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'headline-md': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'headline-sm': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'body-lg': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'body-md': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'body-sm': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'label-lg': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'label-md': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'label-sm': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg-mobile': ['30px', { lineHeight: '38px', letterSpacing: '-0.015em', fontWeight: '800' }],
        'headline-lg': ['28px', { lineHeight: '36px', letterSpacing: '-0.015em', fontWeight: '700' }],
        'headline-md': ['22px', { lineHeight: '30px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '26px', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', letterSpacing: '0.005em', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '700' }]
      },
      boxShadow: {
        xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
        soft: '0 4px 16px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        modal: '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04)'
      }
    }
  }
};

