/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      margin: {
        "custom-sm": "46vw",
        "custom-md": "70vw",
        "custom-lg": "50px",
        "cust-105": "110px",
        "cust-46":"46vw"
      },
      width: {
        "cwid-35": "35vw",
        "cwid-75": "75vw",
      },
      height:{
        "cht-50":"50vh",
        "cht-83":"83vh",
        "cht-123":"123.5vh",
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "garden", "lofi"],
  },
};
