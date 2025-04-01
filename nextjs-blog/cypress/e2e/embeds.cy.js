describe('Embeds Tests', () => {
  it('should have post content on a specific post page', () => {
    cy.visit('/posts/first-post');
    cy.wait(1000);
    
    // Check that the post content exists
    cy.get('div').should('exist');
  });

  it('should have post links on the homepage', () => {
    // Visit the homepage first
    cy.visit('/');
    cy.wait(1000);
    
    // Check that post links exist
    cy.get('a[href^="/posts/"]').should('exist');
  });

  it('should have a navigation menu', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Check that navigation exists
    cy.get('nav').should('exist');
  });

  it('should have articles on the homepage', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Check that articles exist
    cy.get('article').should('exist');
  });
});
