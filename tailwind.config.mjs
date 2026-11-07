import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colours mirror the live paramai.in look (design-tokens.css --q-*): violet neural + cyan teal on a near-black void.
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4c1d95',
          900: '#2e1065',
          950: '#1a0b3d',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#F97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        cyan: {
          400: '#22D3EE',
          500: '#00D4FF',
          600: '#00B4E0',
        },
        ink: {
          50: '#E8E8FF',
          100: '#d5d5f0',
          200: '#BBBBDD',
          300: '#a3a3cc',
          400: '#9999CC',
          500: '#7a7aa8',
          600: '#5a5a88',
          700: '#2a2a4a',
          800: '#14142A',
          900: '#0D0D20',
          950: '#020209',
        },
      },
      fontFamily: {
        sans: ['Outfit', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-links': theme('colors.brand.600'),
            '--tw-prose-headings': theme('colors.ink.900'),
            '--tw-prose-quotes': theme('colors.ink.700'),
            '--tw-prose-bullets': theme('colors.brand.500'),
            maxWidth: 'none',
          },
        },
        invert: {
          css: {
            '--tw-prose-links': theme('colors.brand.300'),
            '--tw-prose-headings': theme('colors.ink.50'),
            '--tw-prose-body': theme('colors.ink.200'),
          },
        },
      }),
    },
  },
  plugins: [typography],
}
