const postcssPresetEnv = require("postcss-preset-env");
const path = require("path");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    postcssPresetEnv({
      importFrom: path.resolve(__dirname, "./src/css/index.css"),
    }),
    autoprefixer({
      browsers: [">1%", "last 2 versions", "not dead"],
    }),
  ],
};
