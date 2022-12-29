/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "normal": ["Open Sans", "sans-serif"],
        "header": ["Ubuntu", "sans-serif"]
      },
      maxWidth: {
        "8xl": "1920px"
      },
      minWidth: {
        "96": "384px"
      },
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: ["halloween"]
  }
};