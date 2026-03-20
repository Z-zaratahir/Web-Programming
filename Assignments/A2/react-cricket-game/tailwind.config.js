/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", 'cursive'],
        body: ["'Nunito'", 'sans-serif'],
      },
      colors: {
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        grass: {
          light: '#7ec850',
          mid:   '#5aad30',
          dark:  '#3d7a1f',
          deep:  '#2a5714',
        },
        brick: {
          light: '#f87171',
          mid:   '#ef4444',
          dark:  '#b91c1c',
        },
        cream: '#fdf6e3',
        pitch: '#d4a96a',
      },
      animation: {
        'float':      'float 3s ease-in-out infinite',
        'bounce-in':  'bounceIn 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both',
        'slide-up':   'slideUp 0.5s ease both',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'sway':       'sway 2s ease-in-out infinite',
        'crowd-wave': 'crowdWave 1.2s ease-in-out infinite',
        'result-pop': 'resultPop 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both',
        'ball-travel':'ballTravel 0.8s ease-in both',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        bounceIn:    { '0%': { transform: 'scale(0.3)', opacity: 0 }, '60%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        slideUp:     { '0%': { transform: 'translateY(30px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        pulseGlow:   { '0%,100%': { boxShadow: '0 0 8px rgba(245,158,11,0.4)' }, '50%': { boxShadow: '0 0 28px rgba(245,158,11,0.9)' } },
        sway:        { '0%,100%': { transform: 'rotate(-5deg)' }, '50%': { transform: 'rotate(5deg)' } },
        crowdWave:   { '0%,100%': { transform: 'translateY(0) scaleY(1)' }, '50%': { transform: 'translateY(-6px) scaleY(1.15)' } },
        resultPop:   { '0%': { transform: 'translate(-50%,-50%) scale(0.2)', opacity: 0 }, '60%': { transform: 'translate(-50%,-50%) scale(1.12)' }, '100%': { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 } },
        shimmer:     { '0%': { backgroundPosition: '-200%' }, '100%': { backgroundPosition: '200%' } },
      },
      boxShadow: {
        'warm':   '0 8px 32px rgba(245,158,11,0.25)',
        'grass':  '0 4px 20px rgba(61,122,31,0.3)',
        'panel':  '0 4px 24px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
