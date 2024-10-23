/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        glow: 'glow 1s ease-in-out infinite alternate',
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
      },
    },
  },
  plugins: [],
}
