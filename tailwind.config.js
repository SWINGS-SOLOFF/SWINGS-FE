export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // 다크 모드 지원
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          light: "#34d399", // emerald-400
          DEFAULT: "#10b981", // emerald-500
          dark: "#059669", // emerald-600
        },
        secondary: {
          light: "#60a5fa", // blue-400
          DEFAULT: "#3b82f6", // blue-500
          dark: "#2563eb", // blue-600
        },
        neon: {
          green: "#32ff7e",
          blue: "#18dcff",
          pink: "#ff3f34",
        },
        darkBg: "#1a1a2e",
        darkCard: "#16213e",
        darkText: "#e5e5e5",
      },
      borderRadius: {
        xl: "1.5rem",
      },
      boxShadow: {
        neon: "0 0 10px rgba(50, 255, 126, 0.8)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(50, 255, 126, 0.8)" },
          "50%": { boxShadow: "0 0 20px rgba(50, 255, 126, 1)" },
        },
      },
      animation: {
        glow: "pulseGlow 1.5s infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
