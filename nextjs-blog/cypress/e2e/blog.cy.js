describe('Blog Tests', () => {
  it('should navigate to the home page', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').should('contain', 'Blog');
    cy.get('ul li a').should('have.length.greaterThan', 0);
  });

  it('should navigate to a blog post', () => {
    cy.visit('http://localhost:3000');
    cy.get('ul li a').first().click();
    cy.get('article h1').should('be.visible');
    cy.get('a').contains('← Back to home').should('be.visible');
  });

  it('should load Twitter embeds', () => {
    cy.visit('http://localhost:3000/posts/harcelement-en-ligne');
    cy.get('article h1').should('contain', 'Harcèlement en Ligne');
    cy.get('.twitter-tweet').should('be.visible');
    
    // Attendre que le script Twitter soit chargé (peut prendre du temps)
    cy.wait(5000);
    cy.get('iframe[id^="twitter-widget"]').should('exist');
  });

  it('should load Bluesky embeds', () => {
    cy.visit('http://localhost:3000/posts/harcelement-en-ligne');
    cy.get('.bluesky-embed').should('be.visible');
  });
});
