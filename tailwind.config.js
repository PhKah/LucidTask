/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#fa9000',
        'live-red': '#c31833',
        'night-navy': '#100e2f',
        hairline: '#d8d8d8',
        'soft-gray': '#f9f9f9',
        'muted-gray': '#555555',
        canvas: '#ffffff',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        pill: '18px',
      },
      scale: {
        '98': '0.98',
      },
    },
  },
  plugins: [],
};
