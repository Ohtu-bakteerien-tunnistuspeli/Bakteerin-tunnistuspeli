describe('Game', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.visit('http://localhost:3000')
    })

    it('Login page can be opened', function() {
        cy.contains('Kirjaudu Bakteeripeliin')
    })

    it('Login page contains login fields and button', function() {
        cy.get('#username').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('#submit').should('contain', 'Kirjaudu')
    })

    it('User can log in', function() {
        cy.get('#username').type('admin')
        cy.get('#password').type('admin')
        cy.get('#submit').click()

        cy.get('div').should('not.contain', 'Kirjaudu Bakteeripeliin')
        cy.contains('Kirjauduit sisään onnistuneesti')
    })

    it('User cannot log in with invalid credentials', function() {
        cy.get('#username').type('username')
        cy.get('#password').type('pass')
        cy.get('#submit').click()

        cy.contains('Kirjaudu Bakteeripeliin')
    })

    describe('After logging in as a normal user', function() {
        beforeEach(function() {
            cy.login({ username: 'user', password: 'user' })
        })

        it('a new bacterium cannot be added', function() {
            cy.get('div').should('not.contain', 'Lisää')
        })

        it('user can log out', function() {
            cy.contains('Kirjaudu ulos').click()
            cy.contains('Kirjaudu Bakteeripeliin')
        })

        describe('and there is a bacterium', function() {
            beforeEach(function() {
                cy.login({ username: 'admin', password: 'admin' })
                cy.addBacterium({ name: 'pneumokokki' })
                cy.login({ username: 'user', password: 'user' })
            })

            it('it can be found on the list', function() {
                cy.contains('pneumokokki')
            })

            it('it cannot be deleted from the list', function() {
                cy.get('div').should('not.contain', '#delete')
            })
        })
    })

    describe('After logging in as admin', function() {
        beforeEach(function() {
            cy.login({ username: 'admin', password: 'admin' })
        })

        it('a new bacterium can be added', function() {
            cy.get('#newBacterium').type('testibakteeri')
            cy.contains('Lisää').click()

            cy.contains('testibakteeri')
        })

        it('user can log out', function() {
            cy.contains('Kirjaudu ulos').click()
            cy.contains('Kirjaudu Bakteeripeliin')
        })

        describe('and there is a bacterium', function() {
            beforeEach(function() {
                cy.addBacterium({ name: 'pneumokokki2' })
            })

            it('it can be found on the list', function() {
                cy.contains('pneumokokki2')
            })

            it('it can be deleted from the list', function() {
                cy.addBacterium({ name: 'testdelete' })

                cy.contains('testdelete').find('#delete').click()
                cy.get('div').should('not.contain', 'testdelete')
            })

        })
    })
    after(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
    })
})