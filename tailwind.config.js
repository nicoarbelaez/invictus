/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        slideLeft: "slideLeft 300ms ease",
        slideRight: "slideRight 300ms ease",
      },
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        }
      }
    },
  },
  plugins: [],
};
