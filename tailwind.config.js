/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0b7db8',
          cyan: '#15a8df',
          primary: '#E72E2E',
          'primary-dark': '#D62828',
          slate: '#d7dbe0',
          ink: '#15324e',
          mist: '#f4f7fa',
        },
      },
      fontFamily: {
        body: ['Manrope', 'Segoe UI', 'sans-serif'],
        display: ['Sora', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 26px 70px rgba(18, 55, 84, 0.14)',
        card: '0 18px 44px rgba(18, 55, 84, 0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'float-soft': 'floatSoft 7s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(22px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        floatSoft: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },
      },
    },
  },
  plugins: [],
};
