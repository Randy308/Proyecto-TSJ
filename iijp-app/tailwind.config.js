/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4A3AFF",
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
};
