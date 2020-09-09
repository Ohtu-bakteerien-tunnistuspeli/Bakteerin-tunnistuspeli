describe('Login page: ', function() {
    beforeEach(function() {
        cy.visit('http://localhost:3000')
    })
    
    it('Login page can be opened', function() {
        cy.contains('Log in to Bakteeripeli')
    })

    it('Login page contains login fields and button', function() {
        cy.get('#username').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('#submit').should('contain', 'login')
    })

    it('User can log in', function() {
        cy.get('#username').type('username')
        cy.get('#password').type('password')
        cy.get('#submit').click()

        cy.get('div').should('not.contain', 'Log in to Bakteeripeli')
    })

    it('User cannot log in with invalid credentials', function() {
        cy.get('#username').type('username')
        cy.get('#password').type('pass')
        cy.get('#submit').click()

        cy.contains('Log in to Bakteeripeli')
    })
})