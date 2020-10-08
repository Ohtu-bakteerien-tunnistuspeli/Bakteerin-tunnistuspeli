describe('Palying game', function () {
    beforeEach(function () {
        cy.login({ username: 'admin', password: 'admin' })
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
        cy.addBacterium({ name: 'Streptococcus agalactiae' })
        cy.addTest({ name: 'Veriagar, +37 C, aerobinen kasvatus', type: 'Viljely' })
        cy.addTest({ name: 'Gramvärjäys', type: 'Värjäys' })
        cy.addTest({ name: 'Katalaasitesti', type: 'Testi' })
        cy.addTest({ name: 'HIRS-sarja', type: 'Testi' })
        cy.addTest({ name: 'Eskuliiniveriagar', type: 'Viljely' })
        cy.addTest({ name: 'Edwardsin agar', type: 'Viljely' })
        cy.addTest({ name: 'CAMP-testi', type: 'Testi' })
        cy.addTest({ name: 'Lancefield määritys', type: 'Testi' })        
        cy.addTest({ name: 'Penisilliinin sietokoe agarvaluamenetelmällä', type: 'Testi'})
        const textForAnamesis = 'Tilalla on 27 lypsävää lehmää parsinavetassa ja lisäksi nuorkarjaa. Kuivikkeena käytetään kutteria, vesi tulee omasta kaivosta. Pääosa lehmistä on omaa tuotantoa, mutta navetan laajennuksen yhteydessä edellisenä kesänä hankittiin muutama uusi tiine eläin, jotka poikivat loppusyksystä.'
         'Yleisesti utareterveys on ollut tilalla hyvä; yksi lehmä on solutellut jo pidempään. Muurikki on alkanut oireilla vasta hiljan. Varsinaisia yleisoireita ei ole aivan hienoista vaisuutta lukuun ottamatta. Utare on kuitenkin selvästi turvonnut, soluluku noussut kaikissa neljänneksissä ja maitomäärä pudonnut.'
         'Vasemman takaneljänneksen maito on hiukan kokkareista. '
        const samples = JSON.stringify([{ 
            description: 'Tankin maitonäyte',
            rightAnswer: false
            }, {
            description: 'Ulostenäyte Muurikilta',
            rightAnswer: false
            }, {
            description: 'Maitonäyte Muurikin kaikista neljänksistä',
            rightAnswer: true
            }, {              
            description: 'Virtsanäyte Muurikilta',
            rightAnswer: false
            }, 
        ])
        let case1 = {
            name: 'Maitotila 1',
            bacterium: '',
            anamnesis: textForAnamesis,
            samples: samples,
            testGroups: [[]]      
        }  
        let case2 = {
            name: 'Maitotila 2',
            bacterium: '',
            anamnesis: 'Purely for testing',
            samples: [],
            testGroups: [[]]      
        }           
        cy.server()
        cy.route('GET','/api/bacteria').as('bacteria')
        cy.visit('http://localhost:3000')

        cy.wait('@bacteria').then(function(xhr) {
            console.log(xhr.responseBody)
            const response = xhr.responseBody
            case1.bacterium = response[0].id
            case2.bacterium = response[0].id
        })
        cy.route('GET', '/api/test').as('tests')
        cy.visit('http://localhost:3000')
        cy.wait('@tests').then(function(xhr) {
            console.log(xhr.responseBody)
            const response = xhr.responseBody
            const sortedResponse = response.sort((test1, test2) => test1.name.localeCompare(test2.name))
            
            const testGroups = JSON.stringify([
                [
                    {
                        testId: sortedResponse[8].id,
                        isRequired: true,
                        positive: true,
                        alternativeTests: false,            
                    }
                ], [
                    {
                        testId: sortedResponse[3].id,
                        isRequired: true,
                        positive: true,
                        alternativeTests: false,            
                    }
                ], [
                    {
                        testId: sortedResponse[5].id,
                        isRequired: true,
                        positive: false,
                        alternativeTests: false,            
                    }
                ], [
                    {
                        testId: sortedResponse[4].id,
                        isRequired: true,
                        positive: true,
                        alternativeTests: false,            
                    }, {
                        testId: sortedResponse[2].id,
                        isRequired: true,
                        positive: true,
                        alternativeTests: true,            
                    }, {
                        testId: sortedResponse[1].id,
                        isRequired: true,
                        positive: true,
                        alternativeTests: true,            
                    }, {
                        testId: sortedResponse[7].id,
                        isRequired: true,
                        positive: true,
                        alternativeTests: false,            
                    }, {
                        testId: sortedResponse[6].id,
                        isRequired: false,
                        positive: true,
                        alternativeTests: false,            
                    }, {
                        testId: sortedResponse[0].id,
                        isRequired: false,
                        positive: true,
                        alternativeTests: false,            
                    },                    
                ],
            ])

            case1.testGroups = testGroups
          }).then(() => {
            cy.addCase({ 
                name: case1.name,
                bacterium: case1.bacterium,
                anamnesis: case1.anamnesis,
                samples: case1.samples,
                testGroups: case1.testGroups
            } )    
            cy.addCase({
                name: case2.name,
                bacterium: case2.bacterium,
                anamnesis: case2.anamnesis,
                samples: JSON.stringify([]),
                testGroups: JSON.stringify([[]])
            })
          })
    })
    describe('Game can be played', function () {
        it('Admin can choose a case which to play', function () {

        })
    
        it('Normal user can choose a case which to play', function () {
    
        })
    
        it('Admin can choose a valid samplingmethod', function () {
    
        })
    
        it('Normal user can choose a valid samplingmethod', function () {
    
        })
    
        it('If wrong samplingmethod is chosen, user/(admin) is informed', function () {
    
        })
    
        it('After selecting wrong method right one can be chosen', function () {
    
        })   
    })
 
    after(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset_bacteria')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_tests')
        cy.request('POST', 'http://localhost:3001/api/testing/reset_cases')
    })
})