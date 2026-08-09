/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cine: {
          bg: "var(--cine-bg)",
          surface: "var(--cine-surface)",
          surface2: "var(--cine-surface2)",
          border: "var(--cine-border)",
          gold: "var(--cine-gold)",
          goldSoft: "var(--cine-gold-soft)",
          text: "var(--cine-text)",
          muted: "var(--cine-muted)",
          danger: "var(--cine-danger)",
        },
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
