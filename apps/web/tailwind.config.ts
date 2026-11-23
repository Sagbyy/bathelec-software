import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const channel = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const brandShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      keyframes: {
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out both',
      },
      colors: {
        brand: Object.fromEntries(
          brandShades.map((shade) => [shade, channel(`brand-${shade}`)])
        ),
        ink: channel('ink'),
        border: channel('border'),
        input: channel('input'),
        ring: channel('ring'),
        background: channel('background'),
        foreground: channel('foreground'),
        primary: {
          DEFAULT: channel('primary'),
          foreground: channel('primary-foreground'),
          soft: channel('primary-soft'),
          'soft-foreground': channel('primary-soft-foreground'),
        },
        secondary: {
          DEFAULT: channel('secondary'),
          foreground: channel('secondary-foreground'),
        },
        destructive: {
          DEFAULT: channel('destructive'),
          foreground: channel('destructive-foreground'),
        },
        success: {
          DEFAULT: channel('success'),
          foreground: channel('success-foreground'),
          soft: channel('success-soft'),
          'soft-foreground': channel('success-soft-foreground'),
        },
        warning: {
          DEFAULT: channel('warning'),
          foreground: channel('warning-foreground'),
          soft: channel('warning-soft'),
          'soft-foreground': channel('warning-soft-foreground'),
        },
        info: {
          DEFAULT: channel('info'),
          foreground: channel('info-foreground'),
          soft: channel('info-soft'),
          'soft-foreground': channel('info-soft-foreground'),
        },
        muted: {
          DEFAULT: channel('muted'),
          foreground: channel('muted-foreground'),
        },
        accent: {
          DEFAULT: channel('accent'),
          foreground: channel('accent-foreground'),
        },
        popover: {
          DEFAULT: channel('popover'),
          foreground: channel('popover-foreground'),
        },
        card: {
          DEFAULT: channel('card'),
          foreground: channel('card-foreground'),
        },
        sidebar: {
          DEFAULT: channel('sidebar'),
          foreground: channel('sidebar-foreground'),
          primary: channel('sidebar-primary'),
          'primary-foreground': channel('sidebar-primary-foreground'),
          accent: channel('sidebar-accent'),
          'accent-foreground': channel('sidebar-accent-foreground'),
          border: channel('sidebar-border'),
          ring: channel('sidebar-ring'),
        },
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
      },
      borderRadius: {
        '2xl': 'calc(var(--radius) + 8px)',
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(10 10 11 / 0.04)',
        card: '0 1px 2px 0 rgb(10 10 11 / 0.04), 0 1px 3px 0 rgb(10 10 11 / 0.04)',
        elevated:
          '0 4px 12px -2px rgb(10 10 11 / 0.08), 0 2px 4px -2px rgb(10 10 11 / 0.04)',
        brand: '0 8px 24px -8px rgb(205 44 53 / 0.45)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [animate],
};

export default config;
