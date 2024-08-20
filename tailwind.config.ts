/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        fade: 'url("../app/public/images/bgFade.png")',
        rosa: 'url("../app/public/images/bgRosa.png")',
        branco: 'url("../app/public/images/bgBranco.png")',
      },
      colors: {
        "afya-pink": "#D8005F",
      },
    },
  },
  plugins: [],
};
