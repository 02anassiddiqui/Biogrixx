/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './layouts/**/*.{js,jsx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        secondary: '#DCFCE7',
        accent: '#FACC15',
        neutral: {
          900: '#111827',
          700: '#374151',
          500: '#6B7280',
          200: '#E5E7EB',
          50: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
