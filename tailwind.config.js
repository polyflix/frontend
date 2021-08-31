module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    minWidth: {
      pagination: "3rem",
    },
    fontFamily: {
      jakarta: ["Jakarta"],
    },
    extend: {
      cursor: {
        grab: "grab",
      },
      inset: {
        nav: "65px",
      },
      fontSize: {
        none: 0,
      },
      width: {
        fit: "fit-content",
      },
      colors: {
        "nx-dark": "#221F1F",
        "nx-red": "#E50914",
        "nx-red-dark": "#B81D24",
        "nx-white": "#F5F5F1",
        "nx-gray": "#cdcaca",
        darkgray: "#161616",
        lightgray: "#949495",
        "light-black": "#0b0b0b",
      },
      screens: {
        portrait: { raw: "(orientation: portrait)" },
        landscape: { raw: "(orientation: landscape)" },
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  variants: {
    extend: {
      translate: ["group-hover"],
      borderStyle: ["hover"],
      width: ["hover"],
      opacity: ["group-hover"],
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
    require('@tailwindcss/aspect-ratio'),
  ],
};
