/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#2a5080',
          DEFAULT: '#1B3A5C',
          dark: '#122840',
        },
        gold: '#C8A96E',
      },
    },
  },
  plugins: [],
}