module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        sakura: "sakuraFall linear infinite",
      },
      keyframes: {
        sakuraFall: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "100%": { transform: "translateY(100vh) rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
