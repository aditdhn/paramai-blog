import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm "study nook" palette. brand = coral/orange (CTA, matches paramai.in #F97316 at 500),
        // accent = calm sage/teal, ink = warm brown (light) / deep aubergine (dark), cream = page.
        // brand-600+ is used behind white text (WCAG AA).
        brand: {
          50: '#FFF4EA',
          100: '#FFE6D0',
          200: '#FFCFA6',
          300: '#FDB074',
          400: '#FB923C',
          500: '#F97316',
          600: '#C2410C',
          700: '#9A3412',
          800: '#7C2D12',
          900: '#5C2008',
          950: '#3B1305',
        },
        accent: {
          50: '#EFF7F4',
          100: '#D8EBE4',
          200: '#B3D8CC',
          300: '#85BFAE',
          400: '#5BA391',
          500: '#3E8776',
          600: '#2F6F60',
          700: '#275A4F',
          800: '#204A41',
          900: '#1B3D36',
          950: '#0F2420',
        },
        ink: {
          50: '#FFFBF5',
          100: '#FBF1E3',
          200: '#EEDFCB',
          300: '#D9C5AD',
          400: '#9A8270',
          500: '#7A6354',
          600: '#5F4A3E',
          700: '#4A382F',
          800: '#43303B',
          900: '#2E2029',
          950: '#1E141C',
        },
        cream: '#FFF8F0',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(74,56,47,0.06), 0 8px 24px -10px rgba(74,56,47,0.16)',
        cozy: '0 2px 4px rgba(74,56,47,0.05), 0 18px 40px -16px rgba(194,65,12,0.28)',
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
            '--tw-prose-body': theme('colors.ink.700'),
            lineHeight: '1.75',
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
