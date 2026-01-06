/** @type {import('tailwindcss').Config} */
export default {
  // 1. Enable class-based dark mode
  darkMode: 'class', 
  
  // 2. Tell Tailwind where your React components are
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // You can add custom colors or fonts here later
      colors: {
        brand: {
          light: '#6366f1', // Indigo 500
          dark: '#4f46e5',  // Indigo 600
        }
      }
    },
  },
  plugins: [],
}