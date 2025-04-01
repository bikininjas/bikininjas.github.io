describe('Navigation Tests', () => {
  it('should navigate to the home page from the navbar', () => {
    cy.visit('/posts/harcelement-en-ligne');
    cy.wait(1000);
    cy.get('a[href="/"]').first().click({ force: true });
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('h1.ParallaxHero_title__K8rqy').should('exist');
  });

  it('should navigate between blog posts', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Get the first post link and store its URL
    cy.get('a[href^="/posts/"]').first().then(($firstLink) => {
      const firstPostUrl = $firstLink.attr('href');
      
      // Click on the first post
      cy.get('a[href^="/posts/"]').first().click({ force: true });
      cy.url().should('include', firstPostUrl);
      
      // Go back to home
      cy.visit('/');
      cy.wait(1000);
      
      // Click on the second post
      cy.get('a[href^="/posts/"]').eq(1).then(($secondLink) => {
        const secondPostUrl = $secondLink.attr('href');
        
        // Make sure it's different from the first post
        expect(secondPostUrl).not.to.eq(firstPostUrl);
        
        cy.get('a[href^="/posts/"]').eq(1).click({ force: true });
        cy.url().should('include', secondPostUrl);
      });
    });
  });

  it('should have a navbar with navigation links', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Verify the navbar exists
    cy.get('nav').should('exist');
    
    // Verify that there are navigation links
    cy.get('nav a').should('exist');
  });
});
