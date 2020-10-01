describe('Test management', function () {
    beforeEach(function () {
        cy.login({ username: 'admin', password: 'admin' })
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
        cy.addBacterium({ name: 'Tetanus' })
        cy.addTest({ name: 'Testi', type: 'Viljely' })
    })

    describe('Cases can be added', function () {
        beforeEach(function () {
        })

        it('A new test without images can be added', function () {
            cy.contains('Testien hallinta').click()
            cy.should('not.contain', 'Katalaasitesti')
            cy.get('#testModalButton').click()
            cy.get('#name').type('Katalaasitesti')
            cy.get('#type').type('Testi')
            cy.get('#addTest').click()
            cy.contains('Testi lisätty onnistuneesti')
            cy.contains('Katalaasitesti')
        })

        it('If test name is not unique, test is not added and error is reported', function () {
            cy.contains('Testien hallinta').click()
            cy.get('#testModalButton').click()
            cy.get('#name').type('Katalaasitesti')
            cy.get('#type').type('Testi')
            cy.get('#addTest').click()
            cy.contains('Testi lisätty onnistuneesti')
            cy.contains('Katalaasitesti')
            cy.get('#testModalButton').click()
            // Since UI doesn't reset name and type we don't have to type them again
            // cy.get('#name').type('Katalaasitesti')
            // cy.get('#type').type('Testi')
            cy.get('#addTest').click()
            cy.contains('Testin nimen tulee olla uniikki')
        })

        it('If name validation fails, test is not added and error is reported', function () {
            cy.contains('Testien hallinta').click()
            cy.get('#testModalButton').click()
            cy.get('#name').type('a')
            cy.get('#type').type('Testi')
            cy.get('#addTest').click()
            cy.contains('Testin nimen tulee olla vähintään 2 merkkiä pitkä')
        })

        it('If type validation fails, test is not added and error is reported', function () {
            cy.contains('Testien hallinta').click()
            cy.get('#testModalButton').click()
            cy.get('#name').type('Katalaasitesti')
            cy.get('#type').type('a')
            cy.get('#addTest').click()
            cy.contains('Testin tyypin tulee olla vähintään 2 merkkiä pitkä')
        })

        it('User cannot add a test', function () {
            cy.login({ username: 'user', password: 'user' })
            cy.get('div').should('not.contain', 'Testien hallinta')
        })
    })

    after(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
    })
})