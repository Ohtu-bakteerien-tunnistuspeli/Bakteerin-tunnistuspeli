const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Bacterium = require('../models/bacterium')
const User = require('../models/user')
const Test = require('../models/testCase')
const Case = require('../models/case')

beforeEach(async () => {
    await Bacterium.deleteMany({})
    await User.deleteMany({})
    await Test.deleteMany({})
    await Case.deleteMany({})
    const adminPassword = await bcrypt.hash('admin', 10)
    const userPassword = await bcrypt.hash('password', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true, email: 'example@com' })
    const user = new User({ username: 'usernameNew', passwordHash: userPassword, admin: false, email: 'example@com' })
    await admin.save()
    await user.save()
    const bacterium = new Bacterium({ name: 'Streptococcus agalactiae' })
    await bacterium.save()
    const veriagar = new Test({ name: 'Veriagar, +37 C, aerobinen kasvatus', type: 'Viljely' })
    await veriagar.save()
    const gram = new Test({ name: 'Gramvärjäys', type: 'Värjäys' })
    await gram.save()
    const katalaasi = new Test({ name: 'Katalaasitesti', type: 'Testi' })
    await katalaasi.save()
    const hirs = new Test({ name: 'HIRS-sarja', type: 'Testi' })
    await hirs.save()
    const eskuliini = new Test({ name: 'Eskuliiniveriagar', type: 'Viljely' })
    await eskuliini.save()
    const edwards = new Test({ name: 'Edwardsin agar', type: 'Viljely' })
    await edwards.save()
    const camp = new Test({ name: 'CAMP-testi', type: 'Testi' })
    await camp.save()
    const lancefield = new Test({ name: 'Lancefield määritys', type: 'Testi' })
    await lancefield.save()
    const penisilliini = new Test({ name: 'Penisilliinin sietokoe agarvaluamenetelmällä', type: 'Testi' })
    await penisilliini.save()

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
        bacterium: bacterium,
        anamnesis: textForAnamesis,
        samples: samples,
        testGroups: [[]],
        complete: true
    }
    const testGroups = [
        [
            {
                tests: [{
                    test: veriagar,
                    positive: true
                }],
                isRequired: true,
            }
        ], [
            {
                tests: [{
                    test: gram,
                    positive: true
                }],
                isRequired: true
            }
        ], [
            {
                tests: [{
                    test: katalaasi,
                    positive: false
                }],
                isRequired: true,
            }
        ], [
            {
                tests: [{
                    test: hirs,
                    positive: true
                }],
                isRequired: true,
            }, {
                tests: [{
                    test: eskuliini,
                    positive: true
                }, {
                    test: edwards,
                    positive: true
                }],
                isRequired: true,
            }, {
                tests: [{
                    test: penisilliini,
                    positive: true
                }],
                isRequired: true,
            }, {
                tests: [{
                    test: lancefield,
                    positive: true
                }],
                isRequired: false,
            }, {
                tests: [{
                    test: camp,
                    postive: true,
                }],
                isRequired: false,
            },
        ],
    ]
    case1.testGroups = testGroups
    await new Case(case1).save()
})

describe('checking sample', () => {
    test('giving correct samples gives correct answer', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const caseToTest = await Case.findOne({ name: 'Maitotila 1' })
        const samples = { samples: ['Maitonäyte Muurikin kaikista neljänneksistä'] }
        const checkingResponse = await api
            .post(`/api/case/${caseToTest.id}/checkSamples`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(samples)
            .expect('Content-Type', /application\/json/)
            .expect(200)
        expect(checkingResponse.body.correct).toEqual(true)
    })

    test('giving wrong samples gives incorrect answer', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const caseToTest = await Case.findOne({ name: 'Maitotila 1' })
        const samples = { samples: ['Virtsanäyte Muurikilta'] }
        const checkingResponse = await api
            .post(`/api/case/${caseToTest.id}/checkSamples`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(samples)
            .expect('Content-Type', /application\/json/)
            .expect(200)
        expect(checkingResponse.body.correct).toEqual(false)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})
