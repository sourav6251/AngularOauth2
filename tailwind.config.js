/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",  // This will include all HTML and TS files in the src folder
    "./src/app/**/*.{html,ts}",  // This will include all HTML and TS files in the src folder
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};