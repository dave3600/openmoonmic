/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moon: {
          light: '#f0f0f0',
          dark: '#2d2d2d',
        },
      },
    },
  },
  plugins: [],
}
