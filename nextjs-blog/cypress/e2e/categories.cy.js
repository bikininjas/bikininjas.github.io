describe('Categories Tests', () => {
  it('should have a navigation menu', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Check that navigation exists
    cy.get('nav').should('exist');
  });

  it('should have articles on the homepage', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Check that articles exist on the homepage
    cy.get('article').should('exist');
  });

  it('should have clickable post links', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Check that post links exist
    cy.get('a[href^="/posts/"]').should('exist');
  });
});
