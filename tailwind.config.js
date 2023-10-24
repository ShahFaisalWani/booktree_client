module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sacramento: ["Sacramento", "cursive"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
