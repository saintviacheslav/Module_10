import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/Module_10",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1600,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      
    },
  },
});
