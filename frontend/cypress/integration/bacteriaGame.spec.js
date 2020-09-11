describe('Game', function() {
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
        cy.contains('You Logged In succesfully')
    })

    it('User cannot log in with invalid credentials', function() {
        cy.get('#username').type('username')
        cy.get('#password').type('pass')
        cy.get('#submit').click()

        cy.contains('Log in to Bakteeripeli')
    })

    describe('After logging in', function() {
        beforeEach(function() {
            cy.login({ username: 'username', password: 'password' })
        })

        it('a new bacterium can be added', function() {
            cy.get('#newBacterium').type('testibakteeri')
            cy.contains('Lisää').click()

            cy.contains('testibakteeri')
        })

        it('user can log out', function() {
            cy.contains('Logout').click()
            cy.contains('Log in to Bakteeripeli')
        })

        describe('and there is a bacterium', function() {
            beforeEach(function() {
                cy.addBacterium({ name: 'pneumokokki' })
            })

            it('it can be found on the list', function() {
                cy.contains('pneumokokki')
            })

            it('it can be deleted from the list', function() {
                cy.addBacterium({ name: 'testdelete' })

                cy.contains('testdelete').find('#delete').click()
                cy.get('div').should('not.contain', 'testdelete')
            })
        })
    })
})