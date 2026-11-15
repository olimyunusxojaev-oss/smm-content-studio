import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: "#F8F5F0",
          dark: "#141211",
          muted: "#F0EBE1",
          "muted-dark": "#1F1C1A",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1C1917",
          cardDark: "#23201D",
          border: "rgba(25, 23, 21, 0.08)",
          borderDark: "rgba(255, 255, 255, 0.1)",
        },
        ink: {
          primary: "#191715",
          secondary: "#7D756C",
          muted: "#A8A199",
          inverted: "#FBF9F5",
          invertedMuted: "#A39E98",
        },
        brand: {
          bronze: "#C5A880",
          bronzeLight: "#E8DBC8",
          bronzeDark: "#9E7E56",
          darkButton: "#181615",
        },
        platform: {
          telegram: "#24A1DE",
          instagram: "#E1306C",
          youtube: "#FF0000",
        },
      },
      borderRadius: {
        squircle: "26px",
        pill: "9999px",
      },
      boxShadow: {
        "soft-card": "0 4px 20px -2px rgba(24, 22, 21, 0.05), 0 1px 3px 0 rgba(24, 22, 21, 0.03)",
        "soft-card-dark": "0 8px 30px -4px rgba(0, 0, 0, 0.4)",
        "floating-dock": "0 -8px 30px rgba(24, 22, 21, 0.08)",
        "floating-dock-dark": "0 -8px 30px rgba(0, 0, 0, 0.5)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
