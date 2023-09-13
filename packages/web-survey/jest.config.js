export default {
  projects: ["<rootDir>", "<rootDir>/packages/*"],
  moduleNameMapper: {
    d3: "<rootDir>/../../node_modules/d3/dist/d3.min.js",
  },
  transformIgnorePatterns: ["/dist/.+\\.js"],
  globalSetup: "<rootDir>/src/dotenv-test.js",
};
