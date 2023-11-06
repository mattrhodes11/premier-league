import ResultsPage from '../e2e/pages/resultsPage'
  
describe('Results test suite', () => {
  let competitions
  let seasons
  let premierLeagueClub

  before(() => {
    cy.fixture('competitions').then(comp => competitions = comp)
    cy.fixture('seasons').then(s => seasons = s)
    cy.fixture('premierLeagueClub').then(plClub => premierLeagueClub = plClub)
  })

  beforeEach(() => {
    // capture the API requests that get all the latest results per competition in descending order
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.premierLeague.compNumber}&compSeasons=${competitions.premierLeague.compSeasons}&teams=${competitions.premierLeague.teams}&page=0&pageSize=20&sort=desc&statuses=C&altIds=true`).as('resultsRequestForAllPremierLeagueClubs')
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.premierLeague2.compNumber}&compSeasons=${competitions.premierLeague2.compSeasons}&teams=${competitions.premierLeague2.teams}&page=0&pageSize=20&sort=desc&statuses=C&altIds=true`).as('resultsRequestForAllPremierLeague2Clubs')
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.under18.compNumber}&compSeasons=${competitions.under18.compSeasons}&teams=${competitions.under18.teams}&page=0&pageSize=20&sort=desc&statuses=C&altIds=true`).as('resultsRequestForAllUnder18Clubs')
  
    // capture the API request that gets the latest results for the specified premier league club in descending order
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.premierLeague.compNumber}&compSeasons=${competitions.premierLeague.compSeasons}&teams=${premierLeagueClub.teamNumber}&page=0&pageSize=20&sort=desc&statuses=C&altIds=true`).as('resultsRequestForSpecificPremierLeagueClub')

    // capture the API request that gets all the results for the previous premier league season in descending order
    cy.intercept('GET', `https://footballapi.pulselive.com/football/fixtures?comps=${competitions.premierLeague.compNumber}&compSeasons=${competitions.premierLeague.previousCompSeason}&teams=${competitions.premierLeague.teamsPreviousSeason}&page=0&pageSize=20&sort=desc&statuses=C&altIds=true`).as('resultsRequestForPreviousPremierLeagueSeason')
      
    cy.visit('')

    ResultsPage.navigateToResultsPage()

    cy.wait('@resultsRequestForAllPremierLeagueClubs').its('response.statusCode').should('eq', 200)
    cy.contains('Loading More Content').should('not.exist')
  })
  
  it('View results - all premier league results for current season displayed as default', () => {
    // assert that the correct tabs are displayed
    cy.assertCompetitionTabs(competitions.premierLeague.shortName, 
      competitions.premierLeague2.shortName,
      competitions.under18.shortName)
  
    // assert that Premier League results for all clubs in the current season are displayed by default
    ResultsPage.assertResultsPageDefaults('Premier League', competitions.premierLeague.shortName, seasons.current)

    // assert at least one results block is displayed
    cy.checkMatchesAreDisplayed()
  })
    
  it('View results for a specific premier league club in the current season', () => {
    // select a specific club and wait for the API response to get the club's latest results
    ResultsPage.viewResultsForSpecificClub(premierLeagueClub.name)
    cy.wait('@resultsRequestForSpecificPremierLeagueClub').its('response.statusCode').should('eq', 200)
    cy.contains('Loading More Content').should('not.exist')
  
    // assert at least one results block is displayed
    cy.checkMatchesAreDisplayed()
  
    // assert that each match involves the specific club team - they could be playing home or away
    cy.assertEachMatchInvolvesExpectedTeam(premierLeagueClub.name)
  
    // reset filters and wait for API response to get results for all premier league clubs
    cy.resetPageFilters('@resultsRequestForAllPremierLeagueClubs')
  
    // assert at least one results block is displayed
    cy.checkMatchesAreDisplayed()
  })

  it('View results for all clubs in the previous premier league season', () => {
    // select the previous premier league season and wait for the API response to get all the season's results 
    ResultsPage.viewResultsForPreviousSeason(seasons.previous)
    cy.wait('@resultsRequestForPreviousPremierLeagueSeason').its('response.statusCode').should('eq', 200)
    cy.contains('Loading More Content').should('not.exist')
  
    // assert at least one results block is displayed
    cy.checkMatchesAreDisplayed()

    // reset filters and wait for API response to get all results for current premier league season
    cy.resetPageFilters('@resultsRequestForAllPremierLeagueClubs')
  
    // assert at least one results block is displayed
    cy.checkMatchesAreDisplayed()
  })
})