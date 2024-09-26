/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#144faf',
        secondary: '#5680c5',
      }
    },
  },
  plugins: [],
};
