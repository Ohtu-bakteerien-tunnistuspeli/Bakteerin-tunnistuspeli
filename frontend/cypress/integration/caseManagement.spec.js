describe('Case management', function () {
    beforeEach(function () {
        cy.login({ username: 'admin', password: 'admin' })
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
        cy.addBacterium({ name: 'Tetanus' })
        cy.addTest({ name: 'Testi', type: 'Viljely' })
    })

    it('Cases can be modified', function () {
        cy.contains('Tapausten hallinta').click()
    })
    describe('Add case', function () {
        beforeEach(function () {
        })

        it('A new case with correct data without image can be added', function () {
            cy.contains('Tapausten hallinta').click()
            cy.should('not.contain', 'Maatila')
            cy.get('#caseModalButton').click()
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').type('Monta nautaa kipeänä.')
            cy.get('#bacterium').select('Tetanus')
            cy.get('#samples').type('Verinäyte')
            cy.get('#isRightAnswer').click()
            cy.get('#addSample').click()
            cy.contains('Verinäyte')
            cy.get('#testSelect').select('Testi')
            cy.get('#required').click()
            cy.get('#positive').click()
            cy.get('#addTestForGroup').click()
            cy.get('#testGroupTable').contains('Testi')
            cy.get('#testGroupTable').contains('Kyllä')
            cy.get('#testGroupTable').contains('Ei')
            cy.get('#addTestGroup').click()
            cy.get('#testGroupsTable').contains('Testi')
            cy.get('#testGroupsTable').contains('Kyllä')
            cy.get('#testGroupsTable').contains('Ei')
            cy.get('#addCase').click()
            cy.contains('Tapauksen Maatila lisäys onnistui.')
            cy.contains('Maatila')
        })

        it('If the validation of the field name, case is not added and error is reported', function () {
            cy.contains('Tapausten hallinta').click()
            cy.get('#caseModalButton').click()
            cy.get('#name').type('M')
            cy.get('#anamnesis').type('Monta nautaa kipeänä.')
            cy.get('#bacterium').select('Tetanus')
            cy.get('#samples').type('Verinäyte')
            cy.get('#isRightAnswer').click()
            cy.get('#addSample').click()
            cy.contains('Verinäyte')
            cy.get('#testSelect').select('Testi')
            cy.get('#addTestForGroup').click()
            cy.get('#testGroupTable').contains('Testi')
            cy.get('#addTestGroup').click()
            cy.get('#testGroupsTable').contains('Testi')
            cy.get('#addCase').click()
            cy.contains('Tapauksen nimen tulee olla vähintään 2 merkkiä pitkä.')
        })

        it('If the field name is not unique, case is not added and error is reported', function () {
            cy.contains('Tapausten hallinta').click()
            cy.get('#caseModalButton').click()
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').type('Monta nautaa kipeänä.')
            cy.get('#bacterium').select('Tetanus')
            cy.get('#samples').type('Verinäyte')
            cy.get('#addSample').click()
            cy.get('#testSelect').select('Testi')
            cy.get('#addTestForGroup').click()
            cy.get('#addTestGroup').click()
            cy.get('#addCase').click()
            cy.get('#caseModalButton').click()
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').type('Monta nautaa kipeänä.')
            cy.get('#bacterium').select('Tetanus')
            cy.get('#samples').type('Verinäyte')
            cy.get('#addSample').click()
            cy.get('#testSelect').select('Testi')
            cy.get('#addTestForGroup').click()
            cy.get('#addTestGroup').click()
            cy.get('#addCase').click()
            cy.contains('Case validation failed: name: Tapauksen nimen tulee olla uniikki.')
        })

        it('A user can not add a case', function () {
            cy.login({ username: 'user', password: 'user' })
            cy.get('div').should('not.contain', 'Tapausten hallinta')
        })

    })

    describe('Modify a case', function () {
        beforeEach(function () {
            const bact = cy.getBacterium({ name: 'Tetanus' })[0]
            cy.addCase({ name:'Tapaus', bacterium: bact.id, anamnesis: 'anamneesi', samples: ['Verinäyte'], testGroups: [[{ name:'Testi', type:'Viljely' }]] })
        })
    })

    describe('Remove a case', function () {
        beforeEach(function () {
            cy.login({ username: 'admin', password: 'admin' })
        })


    })
    after(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
    })
})