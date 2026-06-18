import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // accent red used for eyebrows / small highlights
        red: { brand: "#c0152b" },
        // primary heading / brand maroon
        wine: { DEFAULT: "#8a1538", soft: "#a32647", deep: "#5e0e26" },
        // text scale
        ink: { DEFAULT: "#1a1a1a", 2: "#444444" },
        gray: { brand: "#777777", soft: "#999999" },
        // neutral surfaces
        cream: { DEFAULT: "#f5f5f6", 2: "#fafafa" },
        blush: "#fdeef0",
        line: "#e6e6e8",
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-amiri)", "serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -22px rgba(138, 21, 56, .25)",
        card: "0 2px 10px rgba(0,0,0,.04)",
        "card-hover": "0 14px 34px -14px rgba(0,0,0,.14)",
      },
      borderRadius: {
        xl2: "20px",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,40px) scale(1.08)" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        pulseDot: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(192,21,43,.5)" },
          "50%": { boxShadow: "0 0 0 7px rgba(192,21,43,0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        drift: "drift 16s ease-in-out infinite",
        "drift-slow": "drift 20s ease-in-out infinite reverse",
        floatY: "floatY 6s ease-in-out infinite",
        "float-rev": "floatY 7s ease-in-out infinite reverse",
        pulseDot: "pulseDot 1.8s infinite",
        fadeUp: "fadeUp .45s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
