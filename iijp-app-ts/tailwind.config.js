/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 para todos tus componentes React
  ],
  darkMode: ["class", ".dark-theme"],
  theme: {
    extend: {
      colors: {
        primary: "#4A3AFF",
        main: "#892943",
        second: "#eaf8bf",
        secondary: "#7C5962",
        "red-octopus": {
          DEFAULT: "773243",
          50: "#DBA9B5",
          100: "#D498A7",
          200: "#CD8798",
          300: "#C57589",
          400: "#BE647B",
          500: "#B7536C",
          600: "#AA4760",
          700: "#994056",
          800: "#88394D",
          900: "#773243",
        },
      },
    },
    screens: {
      xs: "480px", // Nuevo punto de interrupción para pantallas pequeñas
      sm: "640px", // Ya existe, pero puedes cambiar el valor si lo necesitas
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1800px",
      "max-xs": { max: "480px" },
      "max-sm": { max: "640px" },
      "max-md": { max: "768px" },
      "max-lg": { max: "1024px" },
      "max-xl": { max: "1280px" },
      "max-2xl": { max: "1536px" },
      custom: { max: "720px" },
    },
  },
  plugins: [],
}