// tailwind.config.cjs
module.exports = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{astro,js,jsx,ts,tsx}',
    './src/components/**/*.{astro,js,jsx,ts,tsx}',
    './src/layouts/**/*.{astro,js,jsx,ts,tsx}',
    './src/original-remix/**/*.{astro,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        primary: "#f7c30c",
        secondary: "#0442e8",
      },
    },
  },
  plugins: [],
};
