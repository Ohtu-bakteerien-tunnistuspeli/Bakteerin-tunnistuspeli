const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Bacterium = require('../models/bacterium')
const User = require('../models/user')
const Test = require('../models/testCase')
const Case = require('../models/case')


const initialBacteria = [{
    name: 'koli'
},
{
    name: 'tetanus'
}]
const initialTest = {
    name: 'testName',
    type: 'testType'
}

beforeEach(async () => {
    await Bacterium.deleteMany({})
    await User.deleteMany({})
    await Test.deleteMany({})
    await Case.deleteMany({})
    const bacteriaObjects = initialBacteria.map(bacterium => new Bacterium(bacterium))
    const promiseArray = bacteriaObjects.map(backterium => backterium.save())
    await Promise.all(promiseArray)
    const adminPassword = await bcrypt.hash('admin', 10)
    const userPassword = await bcrypt.hash('password', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true })
    const user = new User({ username: 'usernameNew', passwordHash: userPassword, admin: false })
    await admin.save()
    await user.save()
    await Test(initialTest).save()
})

describe('addition of a case ', () => {
    test('admin can add a case', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const res = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        const initialLength = res.body.length
        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const testCase = await Test.findOne({ name: 'testName' })
        const newCase = {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
            completitionText: 'test completitionText',
            samples: [{
                description: 'desc 1',
                rightAnswer: true
            }, {
                description: 'desc 2',
                rightAnswer: false
            }],
            testGroups: [[{
                testId: testCase.id,
                isRequired: true,
                positive: true,
                alternativeTests: false
            }]]
        }
        const resp = await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const resAfterAdding = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength + 1)
    })

    test('an invalid case is not added and returns error message', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const res = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)

        const initialLength = res.body.length
        const testCase = await Test.findOne({ name: 'testName' })
        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const newCases = [{
            name: 'testing case',
            bacterium: 'false-id',
            anamnesis: 'test anamnesis',
            completitionText: 'test completitionText',
            samples: [{
                description: 'desc 1',
                rightAnswer: true
            }, {
                description: 'desc 2',
                rightAnswer: false
            }],
            testGroups: [[{
                testId: testCase.id,
                isRequired: true,
                positive: true,
                alternativeTests: false
            }]]
        },{
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
            completitionText: 'test completitionText',
            samples: [{
                description: 'desc 1',
                rightAnswer: true
            }, {
                description: 'desc 2',
                rightAnswer: false
            }],
            testGroups: [[{
                testId: 'false-id',
                isRequired: true,
                positive: true,
                alternativeTests: false
            }]]
        }]
        let addResponse = await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCases[0])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toContain('Annettua bakteeria ei löydy.')
        let resAfterAdding = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
        addResponse = await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCases[1])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toContain('Annettua testiä ei löydy.')
        resAfterAdding = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
    })

    test('user cannot add a case', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
        const admin = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const res = await api
            .get('/api/case')
            .set('Authorization', `bearer ${admin.body.token}`)
        const initialLength = res.body.length
        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const testCase = await Test.findOne({ name: 'testName' })
        const newCase = {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
            completitionText: 'test completitionText',
            samples: [{
                description: 'desc 1',
                rightAnswer: true
            }, {
                description: 'desc 2',
                rightAnswer: false
            }],
            testGroups: [[{
                testId: testCase.id,
                isRequired: true,
                positive: true,
                alternativeTests: false
            }]]
        }
        const addResponse = await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toEqual('token missing or invalid')
        const resAfterAdding = await api
            .get('/api/case')
            .set('Authorization', `bearer ${admin.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
    })
})
afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})
