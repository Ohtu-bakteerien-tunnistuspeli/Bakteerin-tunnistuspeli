describe('Test management', () => {
    beforeEach(() => {
        cy.login({ username: 'admin', password: 'admin' })
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
        cy.addBacterium({ name: 'Tetanus' })
        cy.addTest({ name: 'Cypress Testi', type: 'Viljely' })
    })

    it('User cannot access test management', () => {
        cy.login({ username: 'user', password: 'user' })
        cy.get('div').should('not.contain', 'Testien hallinta')
    })

    describe('Tests can be added', () => {
        beforeEach(() => {
        })

        it('A new test without images can be added', () => {
            cy.contains('Testien hallinta').click()
            cy.should('not.contain', 'Katalaasitesti')
            cy.get('#testModalButton').click()
            cy.get('#name').type('Katalaasitesti')
            cy.get('#type').select('Viljely')
            cy.get('#addTest').click()
            cy.contains('Testi lisätty onnistuneesti')
            cy.contains('Katalaasitesti')
        })

        it('If test name is not unique, test is not added and error is reported', () => {
            cy.contains('Testien hallinta').click()
            cy.get('#testModalButton').click()
            cy.get('#name').type('Katalaasitesti')
            cy.get('#type').select('Viljely')
            cy.get('#addTest').click()
            cy.contains('Testi lisätty onnistuneesti')
            cy.contains('Katalaasitesti')
            cy.get('#testModalButton').click()
            cy.get('#name').type('Katalaasitesti')
            cy.get('#type').select('Viljely')
            cy.get('#addTest').click()
            cy.contains('Testin nimen tulee olla uniikki')
        })

        it('If name validation fails, test is not added and error is reported', () => {
            cy.contains('Testien hallinta').click()
            cy.get('#testModalButton').click()
            cy.get('#name').type('a')
            cy.get('#type').select('Viljely')
            cy.get('#addTest').click()
            cy.contains('Testin nimen tulee olla vähintään 2 merkkiä pitkä')
        })

        it('If type validation fails, test is not added and error is reported', () => {
            cy.contains('Testien hallinta').click()
            cy.get('#testModalButton').click()
            cy.get('#name').type('Katalaasitesti')
            cy.get('#addTest').click()
            cy.contains('Testin tyyppi on pakollinen.')
        })
    })

    describe('Tests can be deleted', () => {
        beforeEach(() => {
        })

        it('Test can be deleted', () => {
            cy.contains('Testien hallinta').click()
            cy.contains('Cypress Testi')
            cy.get('#edit').click()
            cy.get('#deleteTest').click()
            cy.contains('Test successfully deleted')
            cy.should('not.contain', 'Cypress Testi')
        })
    })

    describe('Tests can be modified', () => {
        beforeEach(() => {
        })

        it('Test name can be edited', () => {
            cy.contains('Testien hallinta').click()
            cy.get('#edit').click()
            cy.get('#newNameInput').type(' edited')
            cy.get('#saveChanges').click()
            cy.contains('Cypress Testi edited')
        })

        it('Test type can be edited', () => {
            cy.contains('Testien hallinta').click()
            cy.get('#edit').click()
            cy.get('#newTypeInput').select('Värjäys')
            cy.get('#saveChanges').click()
            cy.contains('Värjäys')
        })
    })

    after(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
    })
})