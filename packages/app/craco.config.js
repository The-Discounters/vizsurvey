const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");

const packages = [];
packages.push(path.join(__dirname, "../components"));

module.exports = {
  webpack: {
    configure: (webpackConfig, arg) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        match.loader.include = include.concat(packages);
      }
      return webpackConfig;
    },
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
    },
    devtool: "eval-source-map",
  },
  babel: {
    extends: "../../babel.config.json",
    presets: ["@babel/preset-react"],
    plugins: [
      ["@babel/plugin-syntax-dynamic-import", { loose: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["@babel/plugin-syntax-import-attributes", { loose: true }],
    ],
    loaderOptions: {
      /* ... */
    },
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      /* ... */
      return babelLoaderOptions;
    },
  },
};
