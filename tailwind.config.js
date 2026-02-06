/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a', // Deep Luxury Black
        secondary: '#171717', // Secondary Dark (Cards)
        accent: {
          DEFAULT: '#7c3aed', // Royal Purple
          dark: '#5b21b6', // Deep Purple (Hover)
          light: '#8b5cf6', // Light Purple
          glow: '#4c1d95', // Subtle Glow
        },
        'base-100': '#0a0a0a', // Base Background
        'base-200': '#171717', // Surface Background
        'surface': '#171717', // Dark cards
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
