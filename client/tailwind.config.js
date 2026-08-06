/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f7ffd9",
          100: "#ecff9c",
          500: "#c6ff00",
          600: "#a9dc00",
          700: "#7ba000",
        },
        secondary: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        surface: "#1e1e1e",
        canvas: "#080909",
        ink: "#f2f2f0",
        muted: "#747474",
        line: "#292929",
        success: "#16a34a",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Anton", "Impact", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        card: "0 24px 60px -24px rgba(0, 0, 0, 0.8)",
        button: "0 12px 30px -12px rgba(198, 255, 0, 0.5)",
      },
    },
  },
  plugins: [],
}
