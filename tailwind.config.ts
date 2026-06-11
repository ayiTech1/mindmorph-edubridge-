import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1200px" }
    },
    extend: {
      colors: {
        // Mindmorph brand palette (see §8.1 of the spec).
        brand: {
          navy: "#0C447C",
          ocean: "#185FA5",
          sky: "#378ADD",
          ice: "#E6F1FB",
          teal: "#1D9E75",
          amber: "#BA7517",
          charcoal: "#2C2C2A",
          slate: "#888780",
          cream: "#F1EFE8"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"]
      },
      fontSize: {
        display: ["3.25rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }]
      },
      borderRadius: {
        card: "12px",
        pill: "20px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,68,124,0.04), 0 4px 12px rgba(12,68,124,0.06)",
        cardHover: "0 4px 16px rgba(12,68,124,0.12)"
      },
      maxWidth: {
        prose: "70ch"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 28s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
