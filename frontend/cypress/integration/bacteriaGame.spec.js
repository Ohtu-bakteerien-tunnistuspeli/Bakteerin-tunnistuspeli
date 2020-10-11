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

    it('User can sign up with valid credentials and then log in', function() {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser')
        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpass')

        cy.get('#acceptCheckBox').click()

        cy.get('#submit').click()

        cy.get('#username').type('newUser')
        cy.get('#password').type('newpass')
        cy.get('#submit').click()

        cy.get('div').should('not.contain', 'Kirjaudu Bakteeripeliin')
    })

    it('User can register with all fields filled in and then login', function() {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser1')
        cy.get('#password').type('newpass1')
        cy.get('#email').type('example@com')
        cy.get('#classGroup').type('C-67')
        cy.get('#studentNumber').type('12345678')

        cy.get('#acceptCheckBox').click()

        cy.get('#submit').click()

        cy.get('#username').type('newUser1')
        cy.get('#password').type('newpass1')
        cy.get('#submit').click()

        cy.get('div').should('not.contain', 'Kirjaudu Bakteeripeliin')


    })

    it('User cannot sign up without accepting the terms and conditions', function() {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser')
        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpass')

        cy.get('#submit').click()

        cy.contains('Käyttöehtojen hyväksyminen on pakollista')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    it('User cannot sign up with taken username', function() {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('admin')
        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpass')
        cy.get('#acceptCheckBox').click()

        cy.get('#submit').click()

        cy.contains('Käyttäjänimen tulee olla uniikki.')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    it('User cannot sign up if passwords do not match', function() {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser')
        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpas')
        cy.get('#acceptCheckBox').click()

        cy.get('#submit').click()

        cy.contains('Salasanojen tulee olla samat.')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    it('User cannot sign up with empty username', function() {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpass')
        cy.get('#acceptCheckBox').click()

        cy.get('#submit').click()

        cy.contains('Käyttäjänimi on pakollinen')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    it('User cannot sign up with empty password', function() {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser')
        cy.get('#acceptCheckBox').click()
        cy.get('#submit').click()

        cy.contains('Salasana on pakollinen')
        cy.contains('Rekisteröidy Bakteeripeliin')
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

            it('it can be edited', function() {
                cy.contains('pneumokokki2').find('#edit').click()

                cy.contains('pneumokokki2').find('#editField').type('pneumokokki3')
                cy.contains('pneumokokki2').find('#saveEdit').click()

                cy.contains('pneumokokki3')
            })

            it('its edit field can be exited without saving changes', function() {
                cy.contains('pneumokokki2').find('#edit').click()
                cy.contains('pneumokokki2').find('#editField').type('pneumokokki3')
                cy.contains('pneumokokki2').find('#stopEdit').click()

                cy.get('div').should('not.contain', 'pneumokokki3')
                cy.contains('pneumokokki2')
            })

        })
    })

    after(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
    })
})