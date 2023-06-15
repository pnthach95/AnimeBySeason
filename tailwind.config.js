/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6183E4',
        bgsignin: '#BBCAF3',
      },
      aspectRatio: {
        poster: '5/7',
        banner: '19/4',
      },
    },
  },
  plugins: [],
};
