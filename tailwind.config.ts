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
        primary: "#d394ff",
        "primary-dim": "#aa30fa",
        "primary-container": "#cb80ff",
        "on-primary": "#4a0076",
        "on-primary-fixed": "#000000",
        background: "#0e0e0e",
        "on-background": "#ffffff",
        surface: "#0e0e0e",
        "on-surface": "#ffffff",
        "surface-variant": "#262626",
        "on-surface-variant": "#adaaaa",
        "surface-container": "#1a1a1a",
        "surface-container-low": "#131313",
        "surface-container-high": "#20201f",
        "surface-container-highest": "#262626",
        "surface-bright": "#2c2c2c",
        "outline": "#767575",
        "outline-variant": "#484847",
        error: "#ff6e84",
        "error-dim": "#d73357",
        tertiary: "#ff888d",
      },
      fontFamily: {
        headline: ["'Noto Serif'", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
