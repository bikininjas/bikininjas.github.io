const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // Le module cypress-multi-reporters n'a pas de sous-module plugin
      // Nous utilisons simplement le reporter sans plugin
    },
    // Configuration des rapports
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'cypress-reporter-config.json',
    },
    // Dossier où seront stockés les résultats des tests
    resultsFolder: 'cypress/results',
    baseUrl: 'http://localhost:3000',
    // Toujours exécuter en mode headless
    headless: true,
    // Désactiver l'affichage des vidéos pour les exécutions en CI
    video: !process.env.CI,
    // Désactiver les captures d'écran pour les tests qui réussissent
    screenshotOnRunFailure: true,
  },
  // Désactiver le navigateur Chrome par défaut
  chromeWebSecurity: false,
});
