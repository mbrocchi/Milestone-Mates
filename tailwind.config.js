/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-teal': '#25C4B4',
        'brand-teal-dark': '#0EB2A1',
        'brand-orange': '#FF6B35',
        'brand-orange-dark': '#FF8800',
        'brand-gold': '#FFC72C',
      }
    },
  },
  plugins: [],
}
