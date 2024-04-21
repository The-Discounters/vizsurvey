const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseURL: "https://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("before:run", (details) => {
        // reset
      });
    },
  },
});
