describe('Integration Tests for Football App', () => {
  const apiBaseUrl = 'http://localhost:5000/api';
  const frontendBaseUrl = 'http://localhost:3000/';
  beforeEach(() => {
    cy.visit(frontendBaseUrl);
  });
  const testEndpoints = [
    {
      method: 'GET',
      path: '/matches/2024-01-01',
      description: 'Matches for a given date',
    },
    {
      method: 'GET',
      path: '/match-details/12345',
      description: 'Match details by ID',
    },
    { method: 'GET', path: '/league/39', description: 'League standings' },
    {
      method: 'GET',
      path: '/player-details/101',
      description: 'Player details',
    },
  ];

  testEndpoints.forEach(({ method, path, description }) => {
    it(`Responds with 200 for ${description}`, () => {
      cy.request({
        method,
        url: `${apiBaseUrl}${path}`,
        failOnStatusCode: false, // Allows checking the status code explicitly
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it('Handles non-existent endpoints gracefully', () => {
    cy.request({
      method: 'GET',
      url: `${apiBaseUrl}/non-existent-endpoint`,
      failOnStatusCode: false, // Avoid failing immediately on non-200 responses
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('Loads matches for a given date', () => {
    const today = new Date().toISOString().split('T')[0];
    cy.visit(`${frontendBaseUrl}/?date=${today}`);

    cy.get('body').then((body) => {
      if (body.find('.MatchesTable').length > 0) {
        cy.get('.MatchesTable').should('exist');
      } else if (body.find('.No-matches').length > 0) {
        cy.get('.No-matches').should('exist');
      }
    });
  });

  it('Navigates to match details and displays information', () => {
    const matchId = 12345;

    cy.visit(`${frontendBaseUrl}match/${matchId}`);
    cy.url().should('include', `/match/${matchId}`);

    cy.get('.fixture-details .home').should('exist');
    cy.get('.fixture-details .away').should('exist');
    cy.get('.fixture-status').should('contain.text', '-');
  });

  it('Loads league standings and allows navigation to club details', () => {
    cy.visit(`${frontendBaseUrl}`);
    cy.get('.league-selector .league-button').contains('La Liga').click();

    cy.get('.standings-table tbody tr').should('have.length.greaterThan', 0);

    cy.get('.standings-table tbody tr').first().find('.team-info').click();
    cy.url().should('include', `/club/`);
  });

  it('Displays player details', () => {
    const playerId = 101;

    cy.visit(`${frontendBaseUrl}player/${playerId}`);
    cy.url().should('include', `/player/${playerId}`);

    cy.get('.player-header').should('exist');
  });
  /*
      it('Handles API errors gracefully', () => {
        const invalidDate = '3000-01-01'; // Неправильна дата
        cy.visit(`${frontendBaseUrl}/?date=${invalidDate}`);

        // Перевіряємо, чи відображається повідомлення про відсутність даних
        cy.get('.No-matches').should('exist');
        cy.get('.No-matches').should('contain.text', 'No matches of popular league');
      });*/
});
