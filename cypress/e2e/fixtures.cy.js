import FixturesPage from '../e2e/pages/fixturesPage'

describe('Fixtures test suite', () => {
  let competitions
  let premierLeagueClub
  
  before(() => {
    cy.fixture('competitions').then(comp => competitions = comp)
    cy.fixture('premierLeagueClub').then(plClub => premierLeagueClub = plClub)
  })

  beforeEach(() => {
    // capture the API requests that get all upcoming fixtures per competition
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.premierLeague.compNumber}&teams=${competitions.premierLeague.teams}&compSeasons=${competitions.premierLeague.compSeasons}&page=0&pageSize=20&sort=asc&statuses=U,L&altIds=true`).as('fixturesRequestForAllPremierLeagueClubs')
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.premierLeague2.compNumber}&teams=${competitions.premierLeague2.teams}&compSeasons=${competitions.premierLeague2.compSeasons}&page=0&pageSize=20&sort=asc&statuses=U,L&altIds=true`).as('fixturesRequestForAllPremierLeague2Clubs')
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.under18.compNumber}&teams=${competitions.under18.teams}&compSeasons=${competitions.under18.compSeasons}&page=0&pageSize=20&sort=asc&statuses=U,L&altIds=true`).as('fixturesRequestForAllUnder18Clubs')

    // capture the API request that gets all upcoming fixtures for the specified premier league club
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.premierLeague.compNumber}&teams=${premierLeagueClub.teamNumber}&compSeasons=${competitions.premierLeague.compSeasons}&page=0&pageSize=20&sort=asc&statuses=U,L&altIds=true`).as('fixturesRequestForSpecificPremierLeagueClub')
    
    cy.visit('')

    FixturesPage.navigateToFixturesPage()

    cy.wait('@fixturesRequestForAllPremierLeagueClubs').its('response.statusCode').should('eq', 200)
    cy.contains('Loading More Content').should('not.exist')
  })

  it('View fixtures - all premier league fixtures for the current season are displayed as default', () => {
    // assert that the correct tabs are displayed
    cy.assertCompetitionTabs(competitions.premierLeague.shortName, 
      competitions.premierLeague2.shortName,
      competitions.under18.shortName)

    // assert that the Premier League fixtures are displayed by default
    FixturesPage.assertFixturesPageDefaults('Premier League', competitions.premierLeague.shortName)

    // assert at least one fixture block is displayed
    cy.checkMatchesAreDisplayed()
  })
  
  it('View fixtures for a specific premier league club in the current season', () => {
    // select a specific club and wait for the API response to get the club's upcoming fixtures
    FixturesPage.viewFixturesForSpecificClub(premierLeagueClub.name)
    cy.wait('@fixturesRequestForSpecificPremierLeagueClub').its('response.statusCode').should('eq', 200)
    cy.contains('Loading More Content').should('not.exist')

    // assert at least one fixture block is displayed
    cy.checkMatchesAreDisplayed()

    // assert that each match involves the specific club team - they could be playing home or away
    cy.assertEachMatchInvolvesExpectedTeam(premierLeagueClub.name)

    // reset filters and wait for API response to get upcoming fixtures for all premier league clubs
    cy.resetPageFilters('@fixturesRequestForAllPremierLeagueClubs')

    // assert at least one fixture block is displayed
    cy.checkMatchesAreDisplayed()
  })

  it('View specific match details', () => {
    FixturesPage.fixtureContainer
      .first()
      .click()

    cy.url().should('include', '/match/')
    cy.go('back')
    cy.url().should('include', '/fixtures')
  })
})