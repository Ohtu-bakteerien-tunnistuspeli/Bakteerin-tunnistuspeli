
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const { TestScheduler } = require('jest')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const adminPassword = await bcrypt.hash('admin', 10)
    const userPassword = await bcrypt.hash('password', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true })
    const user = new User({ username: 'usernameNew', passwordHash: userPassword, admin: false })
    await admin.save()
    await user.save()
})
describe('login ', () => {
    test('login successfull', async () => {
        await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
    })

    test('failed login', async () => {
        await api
            .post('/api/user/login')
            .send({
                username: 'user',
                password: 'pass'
            })
            .expect(400)
    })
})
describe('register ', () => {
    test('valid user can register', async () => {
        await api
            .post('/api/user/register')
            .send({
                username: 'testUser',
                password: 'testPassword'
            })
            .expect(200)
        await api
            .post('/api/user/login')
            .send({
                username: 'testUser',
                password: 'testPassword'
            })
            .expect(200)
    })
    test('in valid user cannot register', async () => {
        const invalidUsers = [{
            username: 'usernameNew',
            password: 'testPassword'
        }, {
            username: 'usernameNew'
        }, {
            username: 'usernameNew',
            password: 't'
        }, {
            username: 'u',
            password: 'testPassword'
        }, {
            username: 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
            password: 'testPassword'
        }]
        let registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[0])
            .expect(400)
        expect(registerResponse.body.error).toContain('Käyttäjänimen tulee olla uniikki.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[0])
            .expect(400)
        registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[1])
            .expect(400)
        expect(registerResponse.body.error).toContain('Salasana on pakollinen.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[1])
            .expect(400)
        registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[2])
            .expect(400)
        expect(registerResponse.body.error).toContain('Salasanan täytyy olla vähintään 3 merkkiä pitkä.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[2])
            .expect(400)
        registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[3])
            .expect(400)
        expect(registerResponse.body.error).toContain('Käyttäjänimen tulee olla vähintään 2 merkkiä pitkä.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[3])
            .expect(400)
        registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[4])
            .expect(400)
        expect(registerResponse.body.error).toContain('Käyttäjänimen tulee olla enintään 100 merkkiä pitkä.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[4])
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})

// "error": "Invalid username or password"