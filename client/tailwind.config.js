/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0070ff",
        secondary: "#ddb7ff",
        tertiary: "#00daf3",

        background: "#0a0a0a",
        surface: "#131313",

        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-low": "#111111",
        "surface-container-lowest": "#0e0e0e",

        "on-background": "#ffffff",
        "on-surface": "#f5f5f5",
        "on-surface-variant": "#d4d4d4",

        outline: "#555555",
        "outline-variant": "#333333",
      },

      spacing: {
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "48px",
        xl: "80px",

        "margin-desktop": "32px",
        "margin-mobile": "16px",

        base: "4px",
      },

      fontFamily: {
        sans: ["Geist", "sans-serif"],
      },

      fontSize: {
        "display-lg": ["56px", { lineHeight: "64px", fontWeight: "700" }],
        "display-lg-mobile": ["40px", { lineHeight: "48px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["20px", { lineHeight: "30px" }],
        "body-md": ["16px", { lineHeight: "24px" }],
        "label-md": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", fontWeight: "500" }],
      },

      animation: {
        shimmer: "shimmer 3s infinite",
      },

      keyframes: {
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },

          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },

  plugins: [],
};