import './commands'

// set consent cookie before each test to bypass cookies pop-up
beforeEach(() => {
    cy.setConsentCookie()
  })

// don't fail tests when uncaught exceptions occur in the application
Cypress.on('uncaught:exception', (_err) => {
    return false
})

// hide fetch and xhr calls in test runner to reduce clutter
const app = window.top
if (!app.document.head.querySelector("[data-hide-command-log-request]")) {
  const style = app.document.createElement("style")
  style.innerHTML =".command-name-request, .command-name-xhr { display: none }"
  style.setAttribute("data-hide-command-log-request", "")
  app.document.head.appendChild(style)
}

import 'cypress-mochawesome-reporter/register'