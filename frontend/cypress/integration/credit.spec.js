describe('credit management', () => {
    beforeEach(() => {
        cy.login({ username: 'admin', password: 'admin' })
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
        cy.request('POST', 'http://localhost:3001/api/testing/credits')
    })

    describe('Filtering credits', () => {
        beforeEach(() => {
            cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
            cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
            cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
            cy.request('POST', 'http://localhost:3001/api/testing/credits')
        })

        it('Class group filter shows only correct credits', () => {
            cy.contains('Suoritusten hallinta').click()
            cy.contains('user1')
            cy.contains('user2')
            cy.contains('user3')
            cy.get('#classGroupFilter').type('C-15')
            cy.contains('user1')
            cy.should('not.contain', 'user2')
            cy.should('not.contain', 'user3')
        })

        it('Student number filter shows only correct results', () => {
            cy.contains('Suoritusten hallinta').click()
            cy.contains('user1')
            cy.contains('user2')
            cy.contains('user3')
            cy.get('#studentNumberFilter').type('1567')
            cy.contains('user1')
            cy.contains('user2')
            cy.contains('user3')
            cy.get('#studentNumberFilter').type('8')
            cy.contains('user1')
            cy.contains('user2')
            cy.should('not.contain', 'user3')
            cy.get('#studentNumberFilter').type('8')
            cy.contains('user1')
            cy.should('not.contain', 'user2')
            cy.should('not.contain', 'user3')
            cy.get('#studentNumberFilter').type('15')
            cy.contains('user1')
        })
    })

    describe('Deleting credits', () => {
        beforeEach(() => {
        })

        it('Only filtered credits are deleted', () => {
            cy.contains('Suoritusten hallinta').click()
            cy.contains('user1')
            cy.contains('user2')
            cy.contains('user3')
            cy.get('#classGroupFilter').type('C-21')
            cy.get('#deleteCredits').click()
            cy.get('#classGroupFilter').clear()
            cy.contains('user1')
            cy.should('not.contain', 'user2')
            cy.should('not.contain', 'user3')
        })
    })

    describe('Showing individual stats in modal', () => {
        beforeEach(() => {
        })

        it('modal can be opened', () => {
            cy.contains('Suoritusten hallinta').click()
            cy.contains('user1')
            cy.contains('user2')
            cy.contains('user3')
            cy.get('#creditShowLink').click()
            cy.contains('Käyttäjänimi')
            cy.contains('Vuosikurssi')
            cy.contains('Opiskelija numero')
            cy.contains('Sähköposti')
            cy.contains('Suoritukset')
            cy.contains('Maitotila')
        })
    })
})