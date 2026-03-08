/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ECC71',
        secondary: '#FFF8E7',
        accent: '#4DA3FF',
        darkText: '#1F2933',
        lightBg: '#F9FAFB',
      },
      // Custom spacing or typography can be added here if needed beyond Tailwind's defaults
    },
  },
  plugins: [],
}