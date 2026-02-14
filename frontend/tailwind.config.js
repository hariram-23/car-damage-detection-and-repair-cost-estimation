/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        secondary: '#84CC16',
        accent: '#FDE047',
        olive: '#65A30D',
        dark: '#1F2937',
        'dark-light': '#374151',
        'light-bg': '#F5F9F3'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
