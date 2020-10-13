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
    const bacterium = new Bacterium({ name: 'Streptococcus agalactiaee' })
    await bacterium.save()
    const veriagar = new Test({ name: 'Veriagar, +37 C, aerobinen kasvatuss', type: 'Viljely' })
    await veriagar.save()
    const gram = new Test({ name: 'Gramvärjäyss', type: 'Värjäys' })
    await gram.save()
    const katalaasi = new Test({ name: 'Katalaasitestii', type: 'Testi' })
    await katalaasi.save()
    const hirs = new Test({ name: 'HIRS-sarjaa', type: 'Testi' })
    await hirs.save()
    const eskuliini = new Test({ name: 'Eskuliiniveriagarr', type: 'Viljely' })
    await eskuliini.save()
    const edwards = new Test({ name: 'Edwardsin agarr', type: 'Viljely' })
    await edwards.save()
    const camp = new Test({ name: 'CAMP-testii', type: 'Testi' })
    await camp.save()
    const lancefield = new Test({ name: 'Lancefield määrityss', type: 'Testi' })
    await lancefield.save()
    const penisilliini = new Test({ name: 'Penisilliinin sietokoe agarvaluamenetelmällää', type: 'Testi' })
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
        name: 'Maitotila 11',
        bacterium: bacterium,
        anamnesis: textForAnamesis,
        samples: samples,
        testGroups: [[]],
        complete: true
    }
    let case2 = {
        name: 'Maitotila 12',
        bacterium: bacterium,
        anamnesis: textForAnamesis,
        samples: samples,
        testGroups: [[]],
        complete: false
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
    case2.testGroups = testGroups
    await new Case(case1).save()
    await new Case(case2).save()
})

describe('starting game', () => {
    test('user can get list of cases', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
        const getResponse = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .expect('Content-Type', /application\/json/)
            .expect(200)
        expect(getResponse.body).toHaveLength(1)
        expect(getResponse.body[0].id).toBeTruthy()
        expect(getResponse.body[0].name).toBeTruthy()
        expect(getResponse.body[0].samples).toBeUndefined()
        expect(getResponse.body[0].testGroups).toBeUndefined()
        expect(getResponse.body[0].anamnesis).toBeUndefined()
        expect(getResponse.body[0].bacterium).toBeUndefined()
    })

    test('user can get single case to play', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
        const caseToTest = await Case.findOne({ name: 'Maitotila 11' })
        const getResponse = await api
            .get(`/api/case/${caseToTest.id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .expect('Content-Type', /application\/json/)
            .expect(200)
        expect(getResponse.body.id).toBeTruthy()
        expect(getResponse.body.name).toBeTruthy()
        expect(getResponse.body.samples).toBeTruthy()
        expect(getResponse.body.testGroups).toBeUndefined()
        expect(getResponse.body.anamnesis).toBeTruthy()
        expect(getResponse.body.bacterium).toBeUndefined()
    })
})

describe('checking sample', () => {
    test('giving correct samples gives correct answer', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
        const caseToTest = await Case.findOne({ name: 'Maitotila 11' })
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
                username: 'usernameNew',
                password: 'password'
            })
        const caseToTest = await Case.findOne({ name: 'Maitotila 11' })
        const samples = { samples: ['Virtsanäyte Muurikilta'] }
        const checkingResponse = await api
            .post(`/api/case/${caseToTest.id}/checkSamples`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(samples)
            .expect('Content-Type', /application\/json/)
            .expect(200)
        expect(checkingResponse.body.correct).toEqual(false)
    })

    test('giving wrong number of samples gives incorrect answer', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
        const caseToTest = await Case.findOne({ name: 'Maitotila 11' })
        const samples = { samples: ['Maitonäyte Muurikin kaikista neljänneksistä', 'Virtsanäyte Muurikilta'] }
        const checkingResponse = await api
            .post(`/api/case/${caseToTest.id}/checkSamples`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(samples)
            .expect('Content-Type', /application\/json/)
            .expect(200)
        expect(checkingResponse.body.correct).toEqual(false)
    })

    test('giving no samples gives incorrect answer', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
        const caseToTest = await Case.findOne({ name: 'Maitotila 11' })
        const samples = { samples: [] }
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
