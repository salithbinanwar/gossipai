/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        glow: 'glow 1s ease-in-out infinite alternate',
        'water-drop': 'water-drop 1s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          from: {
            'text-shadow': '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #0ff',
          },
          to: {
            'text-shadow': '0 0 20px #fff, 0 0 30px #0ff, 0 0 40px #0ff',
          },
        },
        'water-drop': {
          '0%': {
            transform: 'scale(1)',
            opacity: '0.5',
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0.5',
          },
        },
      },
    },
  },
  plugins: [],
}
