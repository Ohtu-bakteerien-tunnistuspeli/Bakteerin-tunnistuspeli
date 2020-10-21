const router = require('express').Router()
const Bacterium = require('../models/bacterium')
const User = require('../models/user')
const Test = require('../models/testCase')
const Case = require('../models/case')
const bcrypt = require('bcrypt')

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

router.post('/init', async (request, response) => {
    try {
        const saltRounds = 10
        let passwordHash = await bcrypt.hash('user', saltRounds)
        const user = new User({
            username: 'user',
            email: 'example@com',
            admin: false,
            passwordHash
        })
        await user.save()
        passwordHash = await bcrypt.hash('admin', saltRounds)
        const admin = new User({
            username: 'admin',
            email: 'example@com',
            admin: true,
            passwordHash
        })
        await admin.save()
    } catch (error) {
        response.status(200).json()
    }
    response.status(200).json()
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