/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Pharmacy green: primary brand colour (sidebar, actions, positive states)
        brand: {
          50: "#eef8f5",
          100: "#d5efe8",
          200: "#aedfd3",
          300: "#7cc9b9",
          400: "#4aae9d",
          500: "#2b9384",
          600: "#1f766b",
          700: "#1c5e56",
          800: "#1a4c46",
          900: "#183f3b",
          950: "#0a2523",
        },
        // Cool, slightly green-tinted neutrals
        ink: {
          50: "#f5f8f7",
          100: "#edf1f1",
          200: "#dfe5e6",
          300: "#c8d1d3",
          400: "#98a6aa",
          500: "#6c7b81",
          600: "#53626a",
          700: "#3e4c53",
          800: "#27343a",
          900: "#16232a",
          950: "#0d171c",
        },
      },
      fontFamily: {
        sans: ['"Figtree Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque Variable"', '"Figtree Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22, 35, 42, 0.04)",
        pop: "0 12px 32px -8px rgba(22, 35, 42, 0.18), 0 2px 6px rgba(22, 35, 42, 0.06)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "sheet-in": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "sheet-out": { from: { transform: "translateX(0)" }, to: { transform: "translateX(100%)" } },
        "drawer-in": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        "drawer-out": { from: { transform: "translateX(0)" }, to: { transform: "translateX(-100%)" } },
        "pop-in": { from: { opacity: "0", transform: "translate(-50%, -48%) scale(0.97)" }, to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" } },
        "pop-out": { from: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" }, to: { opacity: "0", transform: "translate(-50%, -48%) scale(0.97)" } },
        "menu-in": { from: { opacity: "0", transform: "translateY(-4px) scale(0.98)" }, to: { opacity: "1", transform: "translateY(0) scale(1)" } },
        draw: { from: { strokeDashoffset: "1" }, to: { strokeDashoffset: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-in": "fade-in 160ms ease-out",
        "fade-out": "fade-out 120ms ease-in",
        "sheet-in": "sheet-in 260ms cubic-bezier(0.22, 1, 0.36, 1)",
        "sheet-out": "sheet-out 180ms ease-in",
        "drawer-in": "drawer-in 240ms cubic-bezier(0.22, 1, 0.36, 1)",
        "drawer-out": "drawer-out 160ms ease-in",
        "pop-in": "pop-in 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        "pop-out": "pop-out 140ms ease-in",
        "menu-in": "menu-in 140ms ease-out",
        draw: "draw 2.4s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
