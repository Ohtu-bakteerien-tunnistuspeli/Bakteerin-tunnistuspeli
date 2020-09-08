describe('Login page', function() {
    beforeEach(function() {
        cy.visit('http://localhost:3000')
    })
    
    it('Login page can be opened', function() {
        cy.contains('Log in to application')
    })

    it('Login page contains login fields and button', function() {
        cy.get('#username').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('#submit').should('contain', 'login')
    })
})