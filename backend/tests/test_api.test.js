const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Test = require('../models/test')
const User = require('../models/user')

const initialTests = [
    { name: 'test1', type: 'type1' },
    { name: 'test2', type: 'type2' }
]

beforeEach(async () => {
    await User.deleteMany({})
    await Test.deleteMany({})
    const testObjects = initialTests.map(test => new Test(test))
    const promiseArray = testObjects.map(test => test.save())
    await Promise.all(promiseArray)
    const adminPassword = await bcrypt.hash('admin', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true })
    await admin.save()
    const userPassword = await bcrypt.hash('user', 10)
    const user = new User({ username: 'userNew', passwordHash: userPassword, admin: true })
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

afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})