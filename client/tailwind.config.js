/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        secondary: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        surface: "#ffffff",
        canvas: "#f8fafc",
        ink: "#172033",
        muted: "#64748b",
        line: "#e2e8f0",
        success: "#16a34a",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 24px 60px -24px rgba(30, 41, 59, 0.28)",
        button: "0 12px 24px -12px rgba(79, 70, 229, 0.7)",
      },
    },
  },
  plugins: [],
}
