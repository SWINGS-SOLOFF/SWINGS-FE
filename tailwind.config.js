module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
      colors: {
        "custom-pink": "#FF7E9D",
        "custom-blue": "#87CEEB",
        "custom-purple-empty": "#D8B4FE",
        "custom-purple": "#C084FC",
        "custom-coin": "#A78BFA",
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

  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};
