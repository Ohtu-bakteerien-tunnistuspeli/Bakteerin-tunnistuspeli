const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Test = require('../models/testCase')
const User = require('../models/user')

const initialTestCases = [
    { name: 'test1', type: 'type1' },
    { name: 'test2', type: 'type2' }
]

beforeEach(async () => {
    await User.deleteMany({})
    await Test.deleteMany({})
    const testObjects = initialTestCases.map(test => new Test(test))
    const promiseArray = testObjects.map(test => test.save())
    await Promise.all(promiseArray)
    const adminPassword = await bcrypt.hash('admin', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true })
    await admin.save()
    const userPassword = await bcrypt.hash('user', 10)
    const user = new User({ username: 'userNew', passwordHash: userPassword, admin: false })
    await user.save()
})

describe('test format', () => {
    test('tests are returned as JSON', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
            .expect(200)
        await api
            .get('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

describe('addition of a test', () => {
    test('admin can add a test', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const testsBeforeAdding = await api
            .get('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
        const newTest = {
            name: 'newTest',
            type: 'newType'
        }
        await api
            .post('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newTest)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const testsAfterAdding = await api
            .get('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(testsAfterAdding.body).toHaveLength(testsBeforeAdding.body.length + 1)
    })

    test('user cannot add a test', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'userNew',
                password: 'user'
            })
        const testsBeforeAdding = await api
            .get('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
        const newTest = {
            name: 'newTest',
            type: 'newType'
        }
        const addResponse = await api
            .post('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newTest)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toEqual('token missing or invalid')
        const testsAfterAdding = await api
            .get('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(testsAfterAdding.body).toHaveLength(testsBeforeAdding.body.length)
    })

    test('cannot add two tests with same name', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        const testsBeforeAdding = await api
            .get('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
        const newTest1 = {
            name: 'newTest',
            type: 'newType1'
        }
        const newTest2 = {
            name: 'newTest',
            type: 'newType2'
        }
        await api
            .post('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newTest1)
            .expect(201)
        const res2 = await api
            .post('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newTest2)
            .expect(400)
        expect(res2.body.error).toEqual('Test validation failed: name: Testin nimen tulee olla uniikki.')
        const testsAfterAdding = await api
            .get('/api/test')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(testsAfterAdding.body).toHaveLength(testsBeforeAdding.body.length + 1)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})