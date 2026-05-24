import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base — noir profundo con jerarquía
        ink: {
          950: "#070707",
          900: "#0a0a0a",
          800: "#111111",
          700: "#161616",
          600: "#1c1c1c",
          500: "#232323",
          400: "#2c2c2c",
        },
        // Acentos — dorado champagne (lujo formal)
        gold: {
          50:  "#fbf6e8",
          100: "#f4e9c4",
          200: "#e8d496",
          300: "#d9bb6a",
          400: "#c9a961",   // Acento principal
          500: "#b69044",
          600: "#8f6f31",
          700: "#6a5224",
        },
        // Toque futurista — violeta hielo
        aurora: {
          200: "#e0d4ff",
          300: "#c9b6ff",
          400: "#b794f6",
          500: "#9b7cef",
        },
        // Sistema
        cream: "#f5efe2",
        bone: "#e8e0cf",
        primary: "#c9a961",
        "primary-dim": "#8f6f31",
        background: "#070707",
        "on-background": "#f5efe2",
        surface: "#0a0a0a",
        "on-surface": "#f5efe2",
        "surface-container": "#111111",
        "surface-container-low": "#0a0a0a",
        "surface-container-high": "#161616",
        outline: "#3a3a3a",
        "outline-variant": "#222222",
        muted: "#8a8580",
        error: "#e87171",
      },
      fontFamily: {
        display: ["'Inter Tight'", "Inter", "system-ui", "sans-serif"],
        body: ["'Inter Tight'", "Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      letterSpacing: {
        widest: "0.25em",
        ultra: "0.4em",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "marquee": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 24px rgba(201,169,97,0.20)" },
          "50%":      { boxShadow: "0 0 48px rgba(201,169,97,0.40)" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in":    "fade-in 1.2s ease-out forwards",
        shimmer:      "shimmer 3s linear infinite",
        marquee:      "marquee 40s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
      backgroundImage: {
        "gold-gradient":   "linear-gradient(135deg, #d9bb6a 0%, #c9a961 50%, #8f6f31 100%)",
        "gold-shimmer":    "linear-gradient(90deg, transparent 0%, rgba(201,169,97,0.4) 50%, transparent 100%)",
        "radial-fade":     "radial-gradient(ellipse at center, rgba(201,169,97,0.08), transparent 70%)",
        "noise":           "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
