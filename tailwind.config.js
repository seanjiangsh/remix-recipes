/** @type {import('tailwindcss').Config} */
export default {
  content: ["app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
      },
      textShadow: {
        default: "0 2px 4px rgba(0, 0, 0, 0.10)",
        md: "0 3px 6px rgba(0, 0, 0, 0.15)",
        lg: "0 10px 20px rgba(0, 0, 0, 0.25)",
        xl: "0 20px 40px rgba(0, 0, 0, 0.25)",
        "2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
        none: "none",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow": {
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.10)",
        },
        ".text-shadow-md": {
          textShadow: "0 3px 6px rgba(0, 0, 0, 0.15)",
        },
        ".text-shadow-lg": {
          textShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
        },
        ".text-shadow-xl": {
          textShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        },
        ".text-shadow-2xl": {
          textShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
        },
        ".text-shadow-none": {
          textShadow: "none",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
