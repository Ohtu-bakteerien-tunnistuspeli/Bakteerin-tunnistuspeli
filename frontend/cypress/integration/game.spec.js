describe('Playing game', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
        cy.request('POST', 'http://localhost:3001/api/testing/cases')
        cy.login({ username: 'admin', password: 'admin' })
        cy.visit('http://localhost:3000')
    })
    describe('Game can be played', () => {
        it('Admin can choose a case which to play', () => {
            cy.contains('Etusivu').click()
            cy.get('div').should('contain', 'Maitotila 1')
            cy.get('div').should('contain', 'Maitotila 2')
            cy.contains('Maitotila 1').click()
            cy.get('#samples').should('contain', 'Tankin maitonäyte')
            cy.get('#samples').should('contain', 'Maitonäyte Muurikin kaikista neljänneksistä')
            cy.get('#samples').should('contain', 'Ulostenäyte Muurikilta')
            cy.get('#samples').should('contain', 'Virtsanäyte Muurikilta')
        })

        it('Normal user can choose a case which to play', () => {
            cy.login({ username: 'user', password: 'user' })
            cy.visit('http://localhost:3000')
            cy.contains('Etusivu').click()
            cy.get('div').should('contain', 'Maitotila 1')
            cy.get('div').should('not.contain', 'Maitotila 2')
            cy.contains('Maitotila 1').click()
            cy.get('#samples').should('contain', 'Tankin maitonäyte')
            cy.get('#samples').should('contain', 'Maitonäyte Muurikin kaikista neljänneksistä')
            cy.get('#samples').should('contain', 'Ulostenäyte Muurikilta')
            cy.get('#samples').should('contain', 'Virtsanäyte Muurikilta')
        })

        it('A valid samplingmethod can be chosen', () => {
            cy.login({ username: 'user', password: 'user' })
            cy.contains('Etusivu').click()
            cy.contains('Maitotila 1').click()
            cy.get('div').should('contain', 'Tilalla on 27 lypsävää lehmää parsinavetassa ja lisäksi nuorkarjaa. Kuivikkeena käytetään kutteria, vesi tulee omasta kaivosta. Pääosa lehmistä on omaa tuotantoa, mutta navetan laajennuksen yhteydessä edellisenä kesänä hankittiin muutama uusi tiine eläin, jotka poikivat loppusyksystä.')
            cy.contains('Toiminnot').click()
            cy.get('[type="checkbox"]').eq('2').check()
            cy.get('#checkSamples').click()
            cy.wait(500)
            cy.contains('Oikea vastaus')
        })

        it('If wrong sampling method is chosen, user is informed and right method can be chosen', () => {
            cy.login({ username: 'user', password: 'user' })
            cy.contains('Etusivu').click()
            cy.contains('Maitotila 1').click()
            cy.contains('Toiminnot').click()
            cy.get('[type="checkbox"]').first().check()
            cy.get('#checkSamples').click()
            cy.wait(500)
            cy.contains('Väärä vastaus')
            cy.get('[type="checkbox"]').eq('2').check()
            cy.get('#checkSamples').click()
            cy.wait(500)
            cy.contains('Väärä vastaus')
            cy.get('[type="checkbox"]').first().uncheck()
            cy.get('#checkSamples').click()
            cy.wait(500)
            cy.contains('Oikea vastaus')
        })

        it('After choosing right samplingmethod, user can choose all tests in required order', () => {
            cy.login({ username: 'user', password: 'user' })
            cy.contains('Etusivu').click()
            cy.contains('Maitotila 1').click()
            cy.contains('Toiminnot').click()
            cy.get('[type="checkbox"]').eq('2').check()
            cy.get('#checkSamples').click()
            cy.get('#testView').should('contain', 'Viljelyt')
            cy.get('#testView').should('contain', 'Testit')
            cy.get('#testView').should('contain', 'Värjäys')
            cy.contains('Testi ei kuulu testiryhmiin').click()
            cy.wait(500)
            cy.contains('Väärä vastaus')
            cy.contains('Testejä').click()
            cy.contains('CAMP-testi').click({ force: true })
            cy.wait(500)
            cy.contains('Väärä vastaus')
            cy.contains('Testejä').click()
            cy.contains('Veriagar, +37 C, aerobinen kasvatus').click({ force: true })
            cy.wait(500)
            cy.contains('Oikea vastaus')
            cy.contains('Testejä').click()
            cy.contains('Gramvärjäys').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Katalaasitesti').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('HIRS-sarja').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Eskuliiniveriagar').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Edwardsin agar').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Lancefield määritys').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Penisilliinin sietokoe agarvaluamenetelmällä').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('CAMP-testi').click({ force: true })
            cy.wait(500)
            cy.contains('Oikea vastaus. Kaikki testit tehty.')
        })

        it('After choosing right samplingmethod, user can choose only required tests in required order', () => {
            cy.login({ username: 'user', password: 'user' })
            cy.contains('Etusivu').click()
            cy.contains('Maitotila 1').click()
            cy.contains('Toiminnot').click()
            cy.get('[type="checkbox"]').eq('2').check()
            cy.get('#checkSamples').click()
            cy.contains('Veriagar, +37 C, aerobinen kasvatus').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Gramvärjäys').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Katalaasitesti').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('HIRS-sarja').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Edwardsin agar').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Penisilliinin sietokoe agarvaluamenetelmällä').click({ force: true })
            cy.wait(500)
            cy.contains('Oikea vastaus. Kaikki vaaditut testit tehty.')
        })

        it('User can see results after clicking a right test and without clicking "Tulokset" first', () => {
            cy.login({ username: 'user', password: 'user' })
            cy.contains('Etusivu').click()
            cy.contains('Maitotila 1').click()
            cy.contains('Toiminnot').click()
            cy.get('[type="checkbox"]').eq('2').check()
            cy.get('#checkSamples').click()
            cy.contains('Veriagar, +37 C, aerobinen kasvatus').click({ force: true })
            cy.wait(500)
            cy.get('#resultTable').should('contain', 'Veriagar, +37 C, aerobinen kasvatus')
            cy.get('#resultTable').should('not.contain', 'Gramvärjäys')
            cy.contains('Testejä').click()
            cy.contains('Gramvärjäys').click({ force: true })
            cy.wait(500)
            cy.get('#resultTable').should('contain', 'Gramvärjäys')
        })

        it('User can give diagnosis after choosing at least the required tests', () => {
            cy.login({ username: 'user', password: 'user' })
            cy.contains('Etusivu').click()
            cy.contains('Maitotila 1').click()
            cy.contains('Toiminnot').click()
            cy.get('[type="checkbox"]').eq('2').check()
            cy.get('#checkSamples').click()
            cy.contains('Veriagar, +37 C, aerobinen kasvatus').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Gramvärjäys').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Katalaasitesti').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('HIRS-sarja').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Edwardsin agar').click({ force: true })
            cy.contains('Testejä').click()
            cy.contains('Penisilliinin sietokoe agarvaluamenetelmällä').click({ force: true })
            cy.wait(500)
            cy.contains('Diagnoosi').click()
            cy.get('#bacterium').type('Tetanus')
            cy.contains('Diagnoosi').click()
            cy.get('#checkDiagnosis').click()
            cy.wait(500)
            cy.contains('Väärä vastaus')
            cy.get('#bacterium').clear().type('Streptococcus agalactiae')
            cy.contains('Diagnoosi').click()
            cy.get('#checkDiagnosis').click()
            cy.wait(500)
            cy.contains('Oikea vastaus')
            cy.contains('Well Done!')
        })
    })

    after(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
    })
})