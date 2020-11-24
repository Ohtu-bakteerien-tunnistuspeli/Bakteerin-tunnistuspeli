describe('Case management', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/init')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
        cy.login({ username: 'admin', password: 'admin' })
    })

    describe('Add case', () => {

        it('A new case with correct data without image can be added', () => {
            cy.contains('Tapausten hallinta').click()
            cy.should('not.contain', 'Maatila')
            cy.wait(500)
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#bacterium').select('Tetanus')
            cy.get('#sample').type('Verinäyte')
            cy.get('#isRightAnswer').click()
            cy.get('#addSample').click()
            cy.contains('Verinäyte')
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase').click()
            cy.get('#testSelect').select('Gram-värjäys')
            cy.get('#addTest').click()
            cy.get('#required').click()
            cy.get('#positive').click()
            cy.get('#testGroupTable').contains('Gram-värjäys')
            cy.get('#testGroupTable').get('#positive').should('be.checked')
            cy.get('#testGroupTable').get('#required').should('be.checked')
            cy.get('#addCase').click()
            cy.wait(500)
            cy.contains('Tapauksen Maatila lisäys onnistui.')
            cy.contains('Maatila')
        })

        it('A new case with correct data with all the data fields be added', () => {
            cy.contains('Tapausten hallinta').click()
            cy.should('not.contain', 'Maatila')
            cy.wait(500)
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#completionText').within(() => {
                cy.get('.jodit-wysiwyg').type('monta nautaa oli kipeänä')
            })
            cy.get('#completionImage').click()
            cy.get('#bacterium').select('Tetanus')
            cy.get('#sample').type('Verinäyte')
            cy.get('#isRightAnswer').click()
            cy.get('#addSample').click()
            cy.contains('Verinäyte')
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase').click()
            cy.get('#testSelect').select('Gram-värjäys')
            cy.get('#addTest').click()
            cy.get('#required').click()
            cy.get('#positive').click()
            cy.get('#testGroupTable').contains('Gram-värjäys')
            cy.get('#testGroupTable').get('#positive').should('be.checked')
            cy.get('#testGroupTable').get('#required').should('be.checked')
            cy.get('#addCase').click()
            cy.wait(500)
            cy.contains('Tapauksen Maatila lisäys onnistui.')
            cy.contains('Maatila')
        })

        it('If the validation of the field name, case is not added and error is reported', () => {
            cy.contains('Tapausten hallinta').click()
            cy.wait(500)
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('M')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#bacterium').select('Tetanus')
            cy.get('#sample').type('Verinäyte')
            cy.get('#isRightAnswer').click()
            cy.get('#addSample').click()
            cy.contains('Verinäyte')
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase').click()
            cy.get('#testSelect').select('Gram-värjäys')
            cy.get('#addTest').click()
            cy.get('#testGroupTable').contains('Gram-värjäys')
            cy.get('#testGroupTable').get('#positive').should('not.be.checked')
            cy.get('#testGroupTable').get('#required').should('not.be.checked')
            cy.contains('Nimen tulee olla vähintään 2 merkkiä pitkä.')
        })

        it('If the field name is not unique, case is not added and error is reported', () => {
            cy.contains('Tapausten hallinta').click()
            cy.wait(500)
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#bacterium').select('Tetanus')
            cy.get('#sample').type('Verinäyte')
            cy.get('#addSample').click()
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase').click()
            cy.get('#testSelect').select('Gram-värjäys')
            cy.get('#addTest').click()
            cy.get('#testGroupTable').contains('Gram-värjäys')
            cy.get('#addCase').click()
            cy.wait(500)
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#bacterium').select('Tetanus')
            cy.get('#sample').type('Verinäyte')
            cy.get('#addSample').click()
            cy.contains('Nimen tulee olla uniikki')
        })

        it('A user can not add a case', () => {
            cy.login({ username: 'user', password: 'user' })
            cy.get('div').should('not.contain', 'Tapausten hallinta')
        })

    })

    describe('Modify a case', () => {

        it('The case can be modified', () => {
            cy.login({ username: 'admin', password: 'admin' })
            cy.contains('Tapausten hallinta').click()
            cy.should('not.contain', 'Maatila')
            cy.wait(500)
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#bacterium').select('Tetanus')
            cy.get('#sample').type('Verinäyte')
            cy.get('#isRightAnswer').click()
            cy.get('#addSample').click()
            cy.contains('Verinäyte')
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase').click()
            cy.get('#testSelect').select('Gram-värjäys')
            cy.get('#addTest').click()
            cy.get('#testGroupTable').contains('Gram-värjäys')
            cy.contains('Tetanus')
            cy.get('#addCase').click()
            cy.get('#caseEditButton').click()
            cy.get('#testGroupTable').contains('Gram-värjäys')
            cy.get('#name').type('Maatila2')
            cy.get('#bacterium').select('Koli')
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase').click()
            cy.get('#testSelect').select('Katalaasitesti')
            cy.get('#addTest').click()
            cy.get('#saveEdit').click()
            cy.wait(1000)
            cy.contains('MaatilaMaatila2')
            cy.get('#caseEditButton').click()
            cy.get('#name').should('have.value', 'MaatilaMaatila2')
            cy.contains('Testiryhmä 1')
            cy.contains('Testiryhmä 2')
            cy.get('#testGroupTable').contains('Katalaasitesti')
            cy.get('#testGroupTable').contains('Gram-värjäys')
        })

        it('The old values are on fields, if modal is closed without saving', () => {
            cy.contains('Tapausten hallinta').click()
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#bacterium').select('Tetanus')
            cy.get('#addCase').click()
            cy.wait(500)
            cy.get('#caseEditButton').click({ force: true })
            cy.get('#name').type('Maatila2')
            cy.get('#caseEditButton').click({ force: true })
            cy.get('#name').should('have.value', 'Maatila')
        })

        it('The user can add hints and see them only when answer is wrong', () => {
            cy.login({ username: 'admin', password: 'admin' })
            cy.contains('Tapausten hallinta').click()
            cy.wait(500)
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('Maatilatapaus')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#bacterium').select('Tetanus')
            cy.get('#sample').type('Verinäyte')
            cy.get('#isRightAnswer').click()
            cy.get('#addSample').click()
            cy.contains('Verinäyte')

            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase').click()
            cy.get('#testSelect').select('Katalaasitesti')
            cy.get('#addTest').click()
            cy.get('#testGroupTable').contains('Katalaasitesti')
            cy.get('#required').click()
            cy.get('#positive').click()
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase1').click()
            cy.get('#testSelect1').select('Gram-värjäys')
            cy.get('#addTest1').click()
            cy.get('#testGroupTable1').contains('Gram-värjäys')
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase2').click()
            cy.get('#testSelect2').select('Eskuliiniveriagar')
            cy.get('#addTest2').click()
            cy.get('#testGroupTable2').contains('Eskuliiniveriagar')

            cy.get('#addCase').click()

            cy.get('#addHint').click()
            cy.get('#selectTest').select('Gram-värjäys')
            cy.get('#testHint').type('Vinkkii')
            cy.contains('Tallenna muutokset').click()

            cy.get('#addHint').click()
            cy.contains('Gram-värjäys')
            cy.contains('Vinkkii')
            cy.contains('Tallenna muutokset').click()

            cy.contains('Etusivu').click()
            cy.get('#caseTable').contains('Maatilatapaus').click()
            cy.contains('Toiminnot').click()
            cy.get('[type="checkbox"]').eq('0').check()
            cy.get('#checkSamples').click()
            cy.contains('Eskuliiniveriagar').click()
            cy.wait(500)
            cy.contains('Väärä vastaus')
            cy.contains('Gram-värjäys').click()
            cy.wait(500)
            cy.contains('Vinkkii')
            cy.contains('HIRS-sarja').click()
            cy.contains('Katalaasitesti').click()
            cy.wait(500)
            cy.contains('Oikea vastaus')
            cy.should('not.contain', 'Vinkkii')
        })
    })

    describe('Remove a case', () => {
        beforeEach(() => {
            cy.login({ username: 'admin', password: 'admin' })
        })

        it('The case can be deleted', () => {
            cy.contains('Tapausten hallinta').click()
            cy.should('not.contain', 'Maatila')
            cy.wait(500)
            cy.get('#caseModalButton').click({ force: true })
            cy.get('#name').type('Maatila')
            cy.get('#anamnesis').within(() => {
                cy.get('.jodit-wysiwyg').type('Monta nautaa kipeänä.')
            })
            cy.get('#bacterium').select('Tetanus')
            cy.get('#sample').type('Verinäyte')
            cy.get('#isRightAnswer').click()
            cy.get('#addSample').click()
            cy.wait(500)
            cy.contains('Verinäyte')
            cy.get('#addTestGroup').click()
            cy.get('#addTestForCase').click()
            cy.get('#testSelect').select('Katalaasitesti')
            cy.get('#addTest').click()
            cy.get('#testGroupTable').contains('Katalaasitesti')
            cy.get('#required').click()
            cy.get('#positive').click()
            cy.get('#addCase').click()
            cy.wait(500)
            cy.contains('Maatila')
            cy.get('#deleteCase').click()
        })
    })

    after(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/init')
    })
})