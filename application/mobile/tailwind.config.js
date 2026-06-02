/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1C3A5E",
          gold: "#C9974A",
        },
        surface: "#FFFFFF",
        background: "#F5F5F7",
      },
    },
  },
  plugins: [],
};
