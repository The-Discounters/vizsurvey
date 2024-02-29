const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");

const packages = [];
packages.push(path.join(__dirname, "../components"));

module.exports = {
  devServer: {
    open: ["https://localhost:3000/dev"],
    port: 3000,
    https: true,
  },
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
    presets: ["@babel/preset-react"],
    plugins: [
      ["@babel/plugin-syntax-dynamic-import", { loose: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["@babel/plugin-syntax-import-assertions", { loose: true }],
      ["@babel/plugin-transform-private-methods", { loose: true }],
      ["@babel/plugin-transform-private-property-in-object", { loose: true }],
    ],
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      /* ... */
      return babelLoaderOptions;
    },
  },
  jest: {
    configure: {
      globals: {
        CONFIG: true,
      },
      moduleNameMapper: {
        d3: "<rootDir>/../../node_modules/d3/dist/d3.min.js",
      },
      transformIgnorePatterns: ["/dist/.+\\.js"],
      setupFiles: ["./setupTests.js"],
    },
  },
};
