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
        secondary: '#64748b', // Sophisticated Slate
        accent: {
          DEFAULT: '#d946ef', // Brand Magenta
          dark: '#c026d3', // Hover state
          light: '#f0abfc', // Light accents
        },
        'base-100': '#FFFFFF',
        'base-200': '#F8F9FA',
        'surface': '#18181b', // Dark cards
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
