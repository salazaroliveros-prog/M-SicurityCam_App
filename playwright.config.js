// playwright.config.js
// Configuración básica para Playwright
module.exports = {
  webServer: {
    command: 'npx serve . -l 3000',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
  use: {
    headless: true,
    viewport: { width: 375, height: 667 }, // Simula móvil
  },
};
