/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        background: '#C2D9C2',
        foreground: '#3B4533',
        primary: {
          DEFAULT: '#3B4533',
          foreground: '#C2D9C2',
        },
        secondary: {
          DEFAULT: '#C2D9C2',
          foreground: '#3B4533',
        },
        muted: {
          DEFAULT: '#8FB58F',
          foreground: '#2A3528',
        },
        accent: {
          DEFAULT: '#3B4533',
          foreground: '#C2D9C2',
        },
        'accent-warm': '#C8A951',
        border: '#3B4533',
        input: '#C2D9C2',
        ring: '#3B4533',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        display: ['Orbitron', 'monospace'],
      }
    }
  },
  plugins: []
};
