Cypress.Commands.add('setConsentCookie', () => {
  const date = new Date()
  const consentDateTime = date.toISOString()
  cy.setCookie('OptanonAlertBoxClosed', consentDateTime)
})

Cypress.Commands.add('findElementWithText', (attribute, text) => {
  cy.get(`[${attribute}="${text}"]`)
})

Cypress.Commands.add('checkMatchesAreDisplayed', () => {
  cy.get('#mainContent > div.tabbedContent > div.wrapper.col-12.active > div:nth-child(3) > section')
  .children('.fixtures__date-container')
  .should('have.length.greaterThan', 1)
  .each(($fixtureContainer) => {
    cy.wrap($fixtureContainer)
      .find('.fixtures__date-content-container')
      .should('contain.html', 'time')
  })
})

Cypress.Commands.add('assertCompetitionTabs', (plShortName, pl2ShortName, u18ShortName) => {
  cy.get('.tablist > li').should('have.length', '3').then(items => {
    expect(items[0]).to.contain.text(plShortName)
    expect(items[1]).to.contain.text(pl2ShortName)
    expect(items[2]).to.contain.text(u18ShortName)
  })
})

Cypress.Commands.add('assertEachMatchInvolvesExpectedTeam', (expectedTeam) => {
  cy.get('.fixtures__matches-list > .matchList > .match-fixture > .match-fixture__wrapper > .match-fixture__container')
    .each(($matchContainer) => {
      cy.wrap($matchContainer)
        .find('.match-fixture__team')
        .filter(`:contains(${expectedTeam})`)
        .should('have.length', 1)
    })
})

Cypress.Commands.add('resetPageFilters', (alias) => {
  cy.get('.u-hide-desktop > .filter-button__text').click()
  cy.wait(alias).its('response.statusCode').should('eq', 200)
  cy.contains('Loading More Content').should('not.exist') 
})