import type { Config } from 'tailwindcss'

/** Colours sampled from the EVStyle logo (main-2.jpg): green #71DB3D on graphite #252831 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1240px' } },
    extend: {
      colors: {
        ev: {
          DEFAULT: '#71DB3D',
          50: '#F1FCEB',
          300: '#A6EA82',
          400: '#8BE35E',
          500: '#71DB3D',
          600: '#57B827',
          700: '#3F8A1C',
        },
        night: {
          950: '#0A0C0F',
          900: '#0F1115',
          850: '#14171C',
          800: '#1A1D24',
          700: '#252831',
          600: '#30343F',
          500: '#3D4250',
        },
        mist: { 100: '#F3F5F7', 300: '#C9CED6', 400: '#A3AAB5', 500: '#7E8694' },
      },
      fontFamily: {
        sans: ['"Inter Variable"', '"Noto Sans Armenian Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(113,219,61,.55)',
        'glow-lg': '0 0 60px -10px rgba(113,219,61,.6)',
        card: '0 1px 0 0 rgba(255,255,255,.04) inset, 0 20px 40px -24px rgba(0,0,0,.8)',
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
      },
      keyframes: {
        'pulse-glow': { '0%,100%': { opacity: '.55' }, '50%': { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
