/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Editorial Atelier Palette (Mèche Style)
        stone: {
          50: '#FAF9F6',
          100: '#F5F3EF',
          200: '#E7E3DC',
          300: '#D5CEC4',
          400: '#B0A79A',
          500: '#8A8175',
          600: '#645D54',
          700: '#47423C',
          800: '#2C2925',
          900: '#141311',
        },
        champagne: {
          DEFAULT: '#C5A880',
          hover: '#B5966B',
          light: '#F4EFEA',
          dark: '#A68456',
        },
        noir: {
          DEFAULT: '#0F0F0F',
          soft: '#1A1A1A',
          charcoal: '#262626',
        },
        // Legacy system support
        navy: {
          DEFAULT: '#12183A',
          hover: '#1E2548',
          dark: '#0C1027',
          light: '#232C59'
        },
        coral: {
          DEFAULT: '#EE7A68',
          hover: '#E26956',
          light: '#FDEAE6',
          dark: '#D95844'
        },
        canvas: {
          DEFAULT: '#FAF9F6',
          light: '#FDFCF9',
          white: '#FFFFFF'
        },
        hairline: {
          DEFAULT: '#E7E3DC',
          dark: '#D5CEC4'
        },
        charcoal: '#0F0F0F',
        slateMuted: '#787878',
        subtleGray: '#94A3B8'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'monospace'],
        gujarati: ['"Plus Jakarta Sans"', 'Inter', 'Shruti', '"Gujarati Sangam MN"', '"Noto Sans Gujarati"', 'sans-serif']
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(18, 24, 58, 0.06)',
        'modal-soft': '0 12px 36px -4px rgba(18, 24, 58, 0.12)',
        'coral-glow': '0 8px 24px -4px rgba(238, 122, 104, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-coral': 'flashCoral 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        flashCoral: {
          '0%, 100%': { borderColor: '#EE7A68', boxShadow: '0 0 0 4px rgba(238, 122, 104, 0.25)' },
          '50%': { borderColor: '#12183A', boxShadow: '0 0 0 0 rgba(238, 122, 104, 0)' },
        }
      }
    },
  },
  plugins: [],
};
