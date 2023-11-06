class ResultsPage {
    get resultsMenuItem() {return cy.get('.subNav > ul > :nth-child(3) > a')}
    get pageHeaderTitle() {return cy.get('.page-header__title')}
    get activeTab() {return cy.get('.tablist > .active')}
    get selectedCompetition() {return cy.get('[data-dropdown-block="comps"] > .current')}
    get selectedSeason() {return cy.get('[data-dropdown-block="compSeasons"] > .current')}
    get selectedClub() {return cy.get('.mobile > .current')}
    get adNavBar() {return cy.get('.ad-takeover > .navBar')}

    navigateToResultsPage() {
        this.adNavBar.click()
        this.resultsMenuItem.click()
        this.adNavBar.click()
        cy.url().should('include', '/results')
        this.pageHeaderTitle.should('have.text', 'Results')
    }

    assertResultsPageDefaults(expectedDefaultLeague, expectedDefaultLeagueAltName, currentSeason) {
        this.activeTab.should('have.text', expectedDefaultLeagueAltName)
        this.selectedCompetition.should('have.text', expectedDefaultLeague)
            .invoke('attr', 'aria-expanded')
            .should('eq', 'false')
        this.selectedSeason.should('have.text', currentSeason)
            .invoke('attr', 'aria-expanded')
            .should('eq', 'false')
        this.selectedClub.should('have.text', 'All Clubs')
            .invoke('attr', 'aria-expanded')
            .should('eq', 'false')
    }

    viewResultsForSpecificClub(clubName) {
        this.selectedClub.click()
        cy.findElementWithText('data-option-name', clubName).click({force: true})
    }

    viewResultsForPreviousSeason(previousSeason) {
        this.selectedSeason.click()
        cy.findElementWithText('data-option-name', previousSeason).click({force: true})
    }
}

export default new ResultsPage()