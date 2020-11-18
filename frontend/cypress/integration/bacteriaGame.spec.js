describe('Game', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/init')
        cy.visit('http://localhost:3000')
        cy.contains('Kirjaudu sisään').click()
    })

    it('Login page can be opened', () => {
        cy.contains('Kirjaudu Bakteeripeliin')
    })

    it('Login page contains login fields and button', () => {
        cy.get('#username').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('#submit').should('contain', 'Kirjaudu')
    })

    it('User can check the terms and conditions from the footer', () => {
        cy.contains('Käyttöehdot').click()
        cy.contains('Bakteerien tunnistuspelin käyttöehdot')
    })

    it('User can check the privacy policy from the footer', () => {
        cy.contains('Tietosuojailmoitus').click()
        cy.contains('Rekisterinpitäjä eli tietojesi käsittelystä vastuussa')
    })

    it('User can check the image copyrights from the footer', () => {
        cy.contains('Kuvien Käyttöoikeudet').click()
        cy.contains('Bakteeripelin kuvien käyttöoikeude')
    })

    it('User can log in', () => {
        cy.get('#username').type('admin')
        cy.get('#password').type('admin')
        cy.get('#submit').click()

        cy.get('div').should('not.contain', 'Kirjaudu Bakteeripeliin')
        cy.contains('Kirjauduit sisään onnistuneesti')
    })

    it('User cannot log in with invalid credentials', () => {
        cy.get('#username').type('username')
        cy.get('#password').type('pass')
        cy.get('#submit').click()

        cy.contains('Kirjaudu Bakteeripeliin')
    })

    it('User can sign up with valid credentials and then log in', () => {
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

    it('User can register with all fields filled in and then login', () => {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser1')
        cy.get('#password').type('newpass1')
        cy.get('#email').type('example@e.com')
        cy.get('#classGroup').type('C-67')
        cy.get('#studentNumber').type('12345678')

        cy.get('#acceptCheckBox').click()

        cy.get('#submit').click()

        cy.get('#username').type('newUser1')
        cy.get('#password').type('newpass1')
        cy.get('#submit').click()

        cy.get('div').should('not.contain', 'Kirjaudu Bakteeripeliin')


    })

    it('User cannot sign up without accepting the terms and conditions', () => {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser')
        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpass')
        cy.get('#email').type('example@e.com')
        cy.get('#classGroup').type('C-67')
        cy.get('#studentNumber').type('12345678')
        cy.get('#submit').click()

        cy.contains('Käyttöehtojen hyväksyminen on pakollista')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    it('User cannot sign up with taken username', () => {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('admin')
        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpass')
        cy.get('#acceptCheckBox').click()
        cy.get('#email').type('example@e.com')
        cy.get('#classGroup').type('C-67')
        cy.get('#studentNumber').type('12345678')

        cy.get('#submit').click()

        cy.contains('Käyttäjänimen ja sähköpostiosoitteen tulee olla uniikkeja.')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    it('User cannot sign up if passwords do not match', () => {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser')
        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpas')
        cy.get('#acceptCheckBox').click()
        cy.get('#email').type('example@e.com')
        cy.get('#classGroup').type('C-67')
        cy.get('#studentNumber').type('12345678')

        cy.get('#submit').click()

        cy.contains('Salasanojen tulee olla samat.')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    it('User cannot sign up with empty username', () => {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#password').type('newpass')
        cy.get('#passwordAgain').type('newpass')
        cy.get('#acceptCheckBox').click()

        cy.get('#submit').click()

        cy.contains('Käyttäjänimi on pakollinen')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    it('User cannot sign up with empty password', () => {
        cy.contains('Rekisteröidy').click()
        cy.contains('Rekisteröidy Bakteeripeliin')

        cy.get('#username').type('newUser')
        cy.get('#acceptCheckBox').click()
        cy.get('#submit').click()

        cy.contains('Salasana on pakollinen')
        cy.contains('Rekisteröidy Bakteeripeliin')
    })

    describe('After logging in as a normal user', () => {
        beforeEach(() => {
            cy.login({ username: 'user', password: 'user' })
        })

        it('a new bacterium cannot be added', () => {
            cy.get('div').should('not.contain', 'Lisää')
        })

        it('user can log out', () => {
            cy.contains('Kirjaudu ulos').click()
            cy.contains('Kirjaudu Bakteeripeliin')
        })

        it('User can still check the terms and conditions from the footer', () => {
            cy.contains('Käyttöehdot').click()
            cy.contains('Bakteerien tunnistuspelin käyttöehdot')
        })

        it('User can still check the privacy policy from the footer', () => {
            cy.contains('Tietosuojailmoitus').click()
            cy.contains('Rekisterinpitäjä eli tietojesi käsittelystä vastuussa')
        })

        it('User can still check the image copyrights from the footer', () => {
            cy.contains('Kuvien Käyttöoikeudet').click()
            cy.contains('Bakteeripelin kuvien käyttöoikeudet')
        })

        it('User can go to own profile page', () => {
            cy.contains('user').click()
            cy.contains('Oma profiilini')
        })

        describe('When in profile page', () => {
            beforeEach(() => {
                cy.contains('user').click()
            })
            it('User can delete itself', () => {
                cy.get('#deleteUser').click()
                cy.get('#confirmField').type('user')
                cy.get('#confirm').click()
                cy.contains('Kirjaudu Bakteeripeliin')
                cy.get('#username').type('user')
                cy.get('#password').type('user')
                cy.get('#submit').click()
                cy.contains('Kirjaudu Bakteeripeliin')
            })

            it('Cannot delete itself wihout giving correct confirmation text', () => {
                cy.get('#deleteUser').click()
                cy.get('#confirmField').type('use')
                cy.get('#confirm').should('be.disabled')
            })

            it('Can quit deleting itself', () => {
                cy.get('#deleteUser').click()
                cy.get('#confirmField').type('user')
                cy.get('.close').click()
                cy.contains('Oma profiilini')
            })

            it('User can view their info', () => {
                cy.contains('Käyttäjänimi')
                cy.contains('Opiskelijanumero')
                cy.contains('Sähköposti')
                cy.contains('Vuosikurssi')
                cy.contains('Suoritukset')
                cy.contains('example@com')
                cy.contains('Ei suorituksia')
            })

        })
    })

    describe('After logging in as admin', () => {
        beforeEach(() => {
            cy.login({ username: 'admin', password: 'admin' })
        })

        it('a new bacterium can be added', () => {
            cy.contains('Bakteerien hallinta').click()
            cy.get('#newBacterium').type('testibakteeri')
            cy.contains('Lisää').click()

            cy.contains('testibakteeri')
        })

        it('user can log out', () => {
            cy.contains('Kirjaudu ulos').click()
            cy.contains('Kirjaudu Bakteeripeliin')
        })

        it('Admin can go to own profile page', () => {
            cy.contains('admin').click()
            cy.contains('Oma profiilini')
        })

        describe('When in profile page', () => {
            beforeEach(() => {
                cy.contains('admin').click()
            })

            it('Cannot delete itself wihout giving correct confirmation text', () => {
                cy.get('#deleteUser').click()
                cy.get('#confirmField').type('dmin')
                cy.get('#confirm').should('be.disabled')
            })

            it('Can quit deleting itself', () => {
                cy.get('#deleteUser').click()
                cy.get('#confirmField').type('admin')
                cy.get('.close').click()
                cy.contains('Oma profiilini')
            })

            it('Admin can view their info', () => {
                cy.contains('Käyttäjänimi')
                cy.contains('Opiskelijanumero')
                cy.contains('Sähköposti')
                cy.contains('Vuosikurssi')
                cy.contains('Suoritukset')
                cy.contains('examples@com')
                cy.contains('Ei suorituksia')
            })

            it('Admin can delete itself', () => {
                cy.get('#deleteUser').click()
                cy.get('#confirmField').type('admin')
                cy.get('#confirm').click()
                cy.contains('Kirjaudu Bakteeripeliin')
                cy.get('#username').type('admin')
                cy.get('#password').type('admin')
                cy.get('#submit').click()
                cy.contains('Kirjaudu Bakteeripeliin')
            })

        })

        describe('and there is a bacterium', () => {
            beforeEach(() => {
                cy.addBacterium({ name: 'pneumokokki2' })
            })

            it('it can be found on the list', () => {
                cy.contains('Bakteerien hallinta').click()
                cy.contains('pneumokokki2')
            })

            it('it can be deleted from the list', () => {
                cy.addBacterium({ name: 'testdelete' })
                cy.contains('Bakteerien hallinta').click()
                cy.contains('testdelete').parent().find('#delete').click()
                cy.get('div').should('not.contain', 'testdelete')
            })

            it('it can be edited', () => {
                cy.contains('Bakteerien hallinta').click()
                cy.contains('pneumokokki2').parent().find('#edit').click()

                cy.get('#bacteriumTable').find('#editField').type('pneumokokki3')
                cy.get('#bacteriumTable').find('#saveEdit').click()

                cy.contains('pneumokokki3')
            })

            it('its edit field can be exited without saving changes', () => {
                cy.contains('Bakteerien hallinta').click()
                cy.contains('pneumokokki2').parent().find('#edit').click()
                cy.get('#bacteriumTable').find('#editField').type('pneumokokki3')
                cy.get('#bacteriumTable').find('#stopEdit').click()

                cy.get('div').should('not.contain', 'pneumokokki3')
                cy.contains('pneumokokki2')
            })

        })
    })

    after(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/init')
    })
})