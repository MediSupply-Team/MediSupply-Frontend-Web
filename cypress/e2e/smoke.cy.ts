describe('home page', () => {
  it('loads', () => {
    cy.visit('/')          // usa baseUrl
    cy.get('body').should('exist')
  })
})
