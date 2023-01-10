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
        normal: ["Open Sans", "sans-serif"],
        header: ["Ubuntu", "sans-serif"],
      },
      maxWidth: {
        "8xl": "1920px",
      },
      minWidth: {
        96: "384px",
      },
      spacing: {
        "3/10": "30%",
        "100": "400px",
        "110": "440px",
        "120": "480px",
        "140": "560px",
        "200": "800px",
      },
      minHeight: {
        "40": "160px"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"],
  },
};
