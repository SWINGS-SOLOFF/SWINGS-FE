module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-pink": "#FF7E9D",
      },

      animation: {
        sakura: "sakuraFall linear infinite",
      },
      keyframes: {
        sakuraFall: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "100%": { transform: "translateY(100vh) rotate(360deg)" },
        },
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};