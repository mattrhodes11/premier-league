class FixturesPage {
    get fixturesMenuItem() {return cy.get('.subNav > ul > :nth-child(2) > a')}
    get pageHeaderTitle() {return cy.get('.page-header__title')}
    get activeTab() {return cy.get('.tablist > .active')}
    get selectedCompetition() {return cy.get('.active > .current')}
    get selectedClub() {return cy.get('.mobile > .current')}
    get fixtureContainer() {return cy.get('.fixtures__date-container')}
    get adNavBar() {return cy.get('.ad-takeover > .navBar')}

    navigateToFixturesPage() {
        this.adNavBar.click()
        this.fixturesMenuItem.click()
        this.adNavBar.click()
        cy.url().should('include', '/fixtures')
        cy.title().should('include', 'Premier League Fixtures')
        this.pageHeaderTitle.should('have.text', 'Fixtures')
    }

    assertFixturesPageDefaults(expectedDefaultLeague, expectedDefaultLeagueAltName) {
        this.activeTab.should('have.text', expectedDefaultLeagueAltName)
        this.selectedCompetition.should('have.text', expectedDefaultLeague)
            .invoke('attr', 'aria-expanded')
            .should('eq', 'false')
        this.selectedClub.should('have.text', 'All Clubs')
            .invoke('attr', 'aria-expanded')
            .should('eq', 'false')
    }

    viewFixturesForSpecificClub(clubName) {
        this.selectedClub.click()
        cy.findElementWithText('data-option-name', clubName).click({force: true})
    }
}

export default new FixturesPage()