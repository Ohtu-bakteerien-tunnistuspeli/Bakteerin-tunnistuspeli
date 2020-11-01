const router = require('express').Router()
const bcrypt = require('bcrypt')
const Bacterium = require('../models/bacterium')
const User = require('../models/user')
const Test = require('../models/testCase')
const Case = require('../models/case')
const Credit = require('../models/credit')

router.post('/reset_bacteria', async (request, response) => {
    await Bacterium.deleteMany({})
    response.status(204).end()
})

router.post('/reset_users', async (request, response) => {
    await User.deleteMany({})
    response.status(204).end()
})

router.post('/reset_tests', async (request, response) => {
    await Test.deleteMany({})
    response.status(204).end()
})

router.post('/reset_cases', async (request, response) => {
    await Case.deleteMany({})
    response.status(204).end()
})

router.post('/credits', async (request, response) => {
    await Credit.deleteMany({})
    await User.deleteOne({ username: 'user1' })
    await User.deleteOne({ username: 'user2' })
    await User.deleteOne({ username: 'user3' })
    const pwd = await bcrypt.hash('user', 10)
    const user1 = new User({ username: 'user1', passwordHash: pwd, admin: false, email: 'example1@com', classGroup: 'C-15', studentNumber: '15678815' })
    const user2 = new User({ username: 'user2', passwordHash: pwd, admin: false, email: 'example2@com', classGroup: 'C-21', studentNumber: '15678678' })
    const user3 = new User({ username: 'user3', passwordHash: pwd, admin: false, email: 'example3@com', classGroup: 'C-21', studentNumber: '15674567' })
    await user1.save()
    await user2.save()
    await user3.save()
    const user1Credit = new Credit({
        user: user1.id,
        testCases: [
            'Maitotila 6',
            'Maitotila 4'
        ]
    })
    const user2Credit = new Credit({
        user: user2.id,
        testCases: [
            'Maitotila 23',
            'Maitotila 4'
        ]
    })
    const user3Credit = new Credit({
        user: user3.id,
        testCases: [
            'Maitotila 5',
            'Maitotila 7'
        ]
    })
    await user1Credit.save()
    await user2Credit.save()
    await user3Credit.save()
    response.status(200).end()
})

router.post('/cases', async (request, response) => {
    const bacterium = await new Bacterium({ name: 'Streptococcus agalactiae' }).save()
    const veriagar = await new Test({ name: 'Veriagar, +37 C, aerobinen kasvatus', type: 'Viljely' }).save()
    const gram = await new Test({ name: 'Gramvärjäys', type: 'Värjäys' }).save()
    const katalaasi = await new Test({ name: 'Katalaasitesti', type: 'Testi' }).save()
    const hirs = await new Test({ name: 'HIRS-sarja', type: 'Testi' }).save()
    const eskuliini = await new Test({ name: 'Eskuliiniveriagar', type: 'Viljely' }).save()
    const edwards = await new Test({ name: 'Edwardsin agar', type: 'Viljely' }).save()
    const camp = await new Test({ name: 'CAMP-testi', type: 'Testi' }).save()
    const lancefield = await new Test({ name: 'Lancefield määritys', type: 'Testi' }).save()
    const penisilliini = await new Test({ name: 'Penisilliinin sietokoe agarvaluamenetelmällä', type: 'Testi' }).save()
    await new Test({ name: 'Testi ei kuulu testiryhmiin', type: 'Testi' }).save()

    const textForAnamesis = 'Tilalla on 27 lypsävää lehmää parsinavetassa ja lisäksi nuorkarjaa. Kuivikkeena käytetään kutteria, vesi tulee omasta kaivosta. Pääosa lehmistä on omaa tuotantoa, mutta navetan laajennuksen yhteydessä edellisenä kesänä hankittiin muutama uusi tiine eläin, jotka poikivat loppusyksystä.'
    'Yleisesti utareterveys on ollut tilalla hyvä; yksi lehmä on solutellut jo pidempään. Muurikki on alkanut oireilla vasta hiljan. Varsinaisia yleisoireita ei ole aivan hienoista vaisuutta lukuun ottamatta. Utare on kuitenkin selvästi turvonnut, soluluku noussut kaikissa neljänneksissä ja maitomäärä pudonnut.'
    'Vasemman takaneljänneksen maito on hiukan kokkareista. '
    const samples = [{
        description: 'Tankin maitonäyte',
        rightAnswer: false
    }, {
        description: 'Ulostenäyte Muurikilta',
        rightAnswer: false
    }, {
        description: 'Maitonäyte Muurikin kaikista neljänneksistä',
        rightAnswer: true
    }, {
        description: 'Virtsanäyte Muurikilta',
        rightAnswer: false
    },
    ]
    let case1 = {
        name: 'Maitotila 1',
        bacterium: bacterium.id,
        anamnesis: textForAnamesis,
        samples: samples,
        testGroups: [[]],
        complete: true
    }
    let case2 = {
        name: 'Maitotila 2',
        bacterium: bacterium.id,
        anamnesis: 'Purely for testing',
        samples: [],
        testGroups: [[]],
        complete: false
    }
    const testGroups = [
        [
            {
                tests: [{
                    test: veriagar.id,
                    positive: true
                }],
                isRequired: true,
            }
        ], [
            {
                tests: [{
                    test: gram.id,
                    positive: true
                }],
                isRequired: true
            }
        ], [
            {
                tests: [{
                    test: katalaasi.id,
                    positive: false
                }],
                isRequired: true,
            }
        ], [
            {
                tests: [{
                    test: hirs.id,
                    positive: true
                }],
                isRequired: true,
            }, {
                tests: [{
                    test: eskuliini.id,
                    positive: true
                }, {
                    test: edwards.id,
                    positive: true
                }],
                isRequired: true,
            }, {
                tests: [{
                    test: penisilliini.id,
                    positive: true
                }],
                isRequired: true,
            }, {
                tests: [{
                    test: lancefield.id,
                    positive: true
                }],
                isRequired: false,
            }, {
                tests: [{
                    test: camp.id,
                    postive: true,
                }],
                isRequired: false,
            },
        ],
    ]
    case1.testGroups = testGroups
    await new Case(case1).save()
    await new Case(case2).save()

    response.status(200).json()
})

module.exports = router