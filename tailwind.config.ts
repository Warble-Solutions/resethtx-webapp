import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Rich Black" palette
        black: "#050505",
        paper: "#0a0a0a",

        // The "Luxury Gold" palette
        gold: {
          100: "#F9F1D8",
          200: "#F0DEAA",
          300: "#E6CB7D",
          400: "#C59D24", // CLASSIC GOLD (Main)
          500: "#B08819",
          600: "#A07E1A",
          700: "#7A6013",
          800: "#54420D",
          900: "#2E2407",
        },
      },
      fontFamily: {
        // UPDATED: Now points to Manrope for body text
        sans: ["var(--font-manrope)", "sans-serif"],

        // UPDATED: Now points to Cinzel for headings
        heading: ["var(--font-cinzel)", "serif"],
        display: ["var(--font-cinzel)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;