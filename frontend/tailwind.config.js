/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0e1a",
          800: "#0f1628",
          700: "#141e35",
          600: "#1a2847",
        },
        brand: {
          blue:   "#3b82f6",
          purple: "#8b5cf6",
          cyan:   "#06b6d4",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "travel-gradient": "linear-gradient(135deg, #0a0e1a 0%, #1a1040 50%, #0a0e1a 100%)",
        "card-gradient":   "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
        "hero-gradient":   "linear-gradient(to right, #3b82f6, #8b5cf6)",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0,0,0,0.37)",
        "glow":  "0 0 20px rgba(59,130,246,0.3)",
        "card":  "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "float":     "float 6s ease-in-out infinite",
        "pulse-slow":"pulse 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        }
      }
    },
  },
  plugins: [],
}