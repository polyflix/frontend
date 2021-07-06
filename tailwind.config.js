module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      jakarta: ['Jakarta']
    },
    extend: {
      inset: {
        'nav': '65px'
      },
      colors: {
        "nx-dark": "#221F1F",
        "nx-red": "#E50914",
        "nx-red-dark": "#B81D24",
        "nx-white": "#F5F5F1",
        "nx-gray": "#cdcaca",
      },
      screens: {
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' }
      }
    },
  },
  variants: {
    extend: {
      translate: ['group-hover']
    }
  },
  plugins: [],
}
