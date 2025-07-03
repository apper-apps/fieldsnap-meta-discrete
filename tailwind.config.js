/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#2D3436',
        accent: '#00B894',
        surface: '#FFFFFF',
        background: '#F5F7FA',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#E74C3C',
        info: '#3498DB',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}