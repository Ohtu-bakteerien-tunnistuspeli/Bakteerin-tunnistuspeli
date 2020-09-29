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
        await api
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
        const testCase = await Test.findOne({ name: 'testName' })
        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const newCase = {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const res = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)

        const initialLength = res.body.length
        const newCases = [{
            name: 'testing case',
            bacterium: 'false-id',
            anamnesis: 'test anamnesis',
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
        }, {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        }, {
            name: 't',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        }, {
            name: 'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        addResponse = await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toContain('Tapauksen nimen tulee olla uniikki.')
        resAfterAdding = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
        addResponse = await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCases[2])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toContain('Tapauksen nimen tulee olla vähintään 2 merkkiä pitkä.')
        resAfterAdding = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
        addResponse = await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCases[3])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toContain('Tapauksen nimen tulee olla enintään 100 merkkiä pitkä.')
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

describe('deletion of a case', () => {
    test('admin can delete a case', async () => {
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
        await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const resAfterAdding = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength + 1)
        await api
            .delete(`/api/case/${resAfterAdding.body[0].id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(204)
        const resAfterDelete = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterDelete.body).toHaveLength(initialLength)
    })

    test('user cannot delete a case', async () => {
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
        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const testCase = await Test.findOne({ name: 'testName' })
        const newCase = {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        await api
            .post('/api/case')
            .set('Authorization', `bearer ${admin.body.token}`)
            .send(newCase)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const res = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${admin.body.token}`)
        const initialLength = res.body.length
        const deleteResponse = await api
            .delete(`/api/bacteria/${res.body[0].id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(deleteResponse.body.error).toEqual('token missing or invalid')
        const resAfterDelete = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${admin.body.token}`)
        expect(resAfterDelete.body).toHaveLength(initialLength)
    })
})

describe('modify a case', () => {
    test('admin can modify an existing case', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const testCase = await Test.findOne({ name: 'testName' })
        const newCase = {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const res = await api
            .get('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
        const caseToUpdate = {}
        caseToUpdate.name = 'case testing'
        caseToUpdate.anamnesis = 'anamnesis test'
        const updatedCase = await api
            .put(`/api/case/${res.body[0].id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(caseToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body[0].id).toEqual(updatedCase.body.id)
        expect(updatedCase.body.name).toEqual('case testing')
        expect(updatedCase.body.anamnesis).toEqual('anamnesis test')
    })
    test('user can not modify an existing case', async () => {
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
        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const testCase = await Test.findOne({ name: 'testName' })
        const newCase = {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        await api
            .post('/api/case')
            .set('Authorization', `bearer ${admin.body.token}`)
            .send(newCase)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const res = await api
            .get('/api/case')
            .set('Authorization', `bearer ${admin.body.token}`)
        const caseToUpdate = {}
        caseToUpdate.name = 'case testing'
        caseToUpdate.anamnesis = 'anamnesis test'
        const updatedCase = await api
            .put(`/api/case/${res.body[0].id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(caseToUpdate)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(updatedCase.body.error).toEqual('token missing or invalid')
    })
    test('if modified case is invalid, error is returned', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })

        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const testCase = await Test.findOne({ name: 'testName' })
        let newCase = {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        newCase = {
            name: 'testing case2',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis2',
            samples: [{
                description: 'desc 1.2',
                rightAnswer: true
            }, {
                description: 'desc 2.2',
                rightAnswer: false
            }],
            testGroups: [[{
                testId: testCase.id,
                isRequired: true,
                positive: true,
                alternativeTests: false
            }]]
        }
        const postedCase = await api
            .post('/api/case')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const changes = [{
            name: 'testing case'
        }, {
            name: 'o'
        }, {
            name: 'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
        }, {
            bacterium: 'false-id'
        }, {
            testGroups: [[{
                testId: 'false-id',
                isRequired: true,
                positive: true,
                alternativeTests: false
            }]]
        }]
        let updatetCase = await api
            .put(`/api/case/${postedCase.body.id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(changes[0])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(updatetCase.body.error).toContain('Tapauksen nimen tulee olla uniikki.')
        updatetCase = await api
            .put(`/api/case/${postedCase.body.id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(changes[1])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(updatetCase.body.error).toContain('Tapauksen nimen tulee olla vähintään 2 merkkiä pitkä.')
        updatetCase = await api
            .put(`/api/case/${postedCase.body.id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(changes[2])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(updatetCase.body.error).toContain('Tapauksen nimen tulee olla enintään 100 merkkiä pitkä.')
        updatetCase = await api
            .put(`/api/case/${postedCase.body.id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(changes[3])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(updatetCase.body.error).toContain('Annettua bakteeria ei löydy.')
        updatetCase = await api
            .put(`/api/case/${postedCase.body.id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(changes[4])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(updatetCase.body.error).toContain('Annettua testiä ei löydy.')
    })

    test('cannot modify case that does not exist', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const bacterium = await Bacterium.findOne({ name: 'koli' })
        const testCase = await Test.findOne({ name: 'testName' })
        let newCase = {
            name: 'testing case',
            bacterium: bacterium.id,
            anamnesis: 'test anamnesis',
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
        const res = await api
            .put('/api/case/doesnotexist')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newCase)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.error).toContain('Annettua tapausta ei löydy tietokannasta.')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})
