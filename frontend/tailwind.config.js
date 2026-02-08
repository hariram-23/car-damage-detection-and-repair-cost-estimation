/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00d9ff',
        dark: '#0a0e27',
        'dark-light': '#1a1f3a'
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif']
      }
    },
  },
  plugins: [],
}
