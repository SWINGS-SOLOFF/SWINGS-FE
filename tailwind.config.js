/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {

      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      animation: ['hover', 'focus'],
    },
  },
};