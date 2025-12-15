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
        black: "#050505", // Slightly softer than pure black for depth
        paper: "#0a0a0a", // For cards/backgrounds

        // The "Luxury Gold" palette
        gold: {
          100: "#F9F1D8", // Lightest (highlights)
          200: "#F0DEAA",
          300: "#E6CB7D",
          400: "#D4AF37", // CLASSIC GOLD (Main)
          500: "#C59D24", // Darker Gold (Hover)
          600: "#A07E1A",
          700: "#7A6013",
          800: "#54420D",
          900: "#2E2407",
        },
      },
      fontFamily: {
        // We link these to the variables we set in layout.tsx
        sans: ["var(--font-montserrat)", "sans-serif"],
        heading: ["var(--font-oswald)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;