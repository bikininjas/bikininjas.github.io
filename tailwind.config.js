/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bikininjas-primary': '#3B82F6',
        'bikininjas-secondary': '#10B981',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
