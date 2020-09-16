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
        cy.get('#username').type('admin')
        cy.get('#password').type('admin')
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

    describe('After logging in as a normal user', function() {
        beforeEach(function() {
            cy.login({ username: 'user', password: 'user' })
        })

        it('a new bacterium cannot be added', function() {
            cy.get('div').should('not.contain', 'Lisää')
        })

        it('user can log out', function() {
            cy.contains('Logout').click()
            cy.contains('Log in to Bakteeripeli')
        })

        describe('and there is a bacterium', function() {
            var i = false
            beforeEach(function() {
                cy.login({ username: 'admin', password: 'admin' })
                if (i === false)
                    cy.addBacterium({ name: 'pneumokokki' })
                i = true
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
            cy.contains('Logout').click()
            cy.contains('Log in to Bakteeripeli')
        })

        describe('and there is a bacterium', function() {
            var i = false
            beforeEach(function() {
                if (i)
                    cy.contains('pneumokokki2').find('#delete').click()
                cy.addBacterium({ name: 'pneumokokki2' })
                i = true
            })

            it('it can be found on the list', function() {
                cy.contains('pneumokokki2')
            })

            it('it can be deleted from the list', function() {
                cy.addBacterium({ name: 'testdelete' })

                cy.contains('testdelete').find('#delete').click()
                cy.get('div').should('not.contain', 'testdelete')
            })

            after(function() {
                cy.contains('pneumokokki2').find('#delete').click()
                cy.contains('testibakteeri').find('#delete').click()
                cy.contains('pneumokokki').find('#delete').click()
            })
        })
    })
})