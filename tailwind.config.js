/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#F7F5EB",
        "primary-blue": "#a49bff",
      },
    },
  },
  plugins: [],
};
