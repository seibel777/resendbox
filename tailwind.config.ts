import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Space Grotesk'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -24px rgba(15, 23, 42, 0.35)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px -36px rgba(14, 165, 233, 0.45)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 38%), radial-gradient(circle at 85% 10%, rgba(14, 165, 233, 0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0))",
        "hero-mesh-dark":
          "radial-gradient(circle at top left, rgba(14, 165, 233, 0.22), transparent 35%), radial-gradient(circle at 85% 10%, rgba(45, 212, 191, 0.14), transparent 28%), linear-gradient(180deg, rgba(15,23,42,0.88), rgba(15,23,42,0.48))",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(56, 189, 248, 0.22)",
          },
          "50%": {
            boxShadow: "0 0 0 10px rgba(56, 189, 248, 0)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
