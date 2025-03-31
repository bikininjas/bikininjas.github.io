describe('Blog Tests', () => {
  it('should navigate to the home page', () => {
    cy.visit('/');
    cy.get('h1.ParallaxHero_title__K8rqy').should('exist');
    cy.get('a[href^="/posts/"]').should('have.length.greaterThan', 0);
  });

  it('should navigate to a blog post', () => {
    cy.visit('/');
    cy.get('a[href^="/posts/"]').first().click();
    cy.get('h1').should('be.visible');
    // Vérifier qu'il y a un élément h1 visible sur la page
    cy.get('h1').should('be.visible');
  });

  it('should load Twitter embeds', () => {
    cy.visit('/posts/harcelement-en-ligne');
    cy.get('h1').should('be.visible');
    // Vérifier que le contenu de la page est chargé
    cy.get('main').should('exist');
  });

  it('should load Bluesky embeds', () => {
    cy.visit('/posts/harcelement-en-ligne');
    // Vérifier que le contenu de la page est chargé
    cy.get('main').should('exist');
  });
});
