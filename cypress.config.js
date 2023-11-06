const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
    },
    baseUrl: 'https://www.premierleague.com/',
    experimentalStudio: true,
    experimentalRunAllSpecs: true,
    viewportWidth: 1440,
    viewportHeight: 900,
    reporter: 'cypress-mochawesome-reporter',
  },
})
