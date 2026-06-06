import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#080B12",
          secondary: "#0D1117",
          card: "#0F1520",
          elevated: "#141C2A",
        },
        accent: {
          DEFAULT: "#4F8EF7",
          glow: "#4F8EF740",
          muted: "#4F8EF720",
        },
        gold: {
          DEFAULT: "#F5C842",
          muted: "#F5C84220",
        },
        border: {
          DEFAULT: "#1C2740",
          bright: "#2A3A5C",
        },
        text: {
          primary: "#E8EFFF",
          secondary: "#8A9BBC",
          muted: "#4A5A7A",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(at 20% 20%, #4F8EF718 0px, transparent 50%), radial-gradient(at 80% 80%, #F5C84210 0px, transparent 50%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(79, 142, 247, 0.15)",
        glow: "0 0 30px rgba(79, 142, 247, 0.2)",
        "glow-lg": "0 0 60px rgba(79, 142, 247, 0.25)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        "card-hover":
          "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(79, 142, 247, 0.3), 0 1px 0 rgba(255,255,255,0.06) inset",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
