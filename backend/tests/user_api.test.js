
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const adminPassword = await bcrypt.hash('admin', 10)
    const userPassword = await bcrypt.hash('password', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true, email: 'example@com' })
    const user = new User({ username: 'usernameNew', passwordHash: userPassword, admin: false, email: 'example@com' })
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
    test('valid user with compolsory fields can register', async () => {
        await api
            .post('/api/user/register')
            .send({
                username: 'testUser',
                password: 'testPassword',
                email: 'example@com'
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
    test('valid user with all fields can register', async () => {
        await api
            .post('/api/user/register')
            .send({
                username: 'testUser',
                password: 'testPassword',
                email: 'example@com',
                classGroup: 'C-76',
                studentNumber: '1234567'
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
    test('invalid user cannot register', async () => {
        const invalidUsers = [{
            username: 'usernameNew',
            password: 'testPassword',
            email: 'example@com'
        }, {
            username: 'usernameNew'
        }, {
            username: 'usernameNew',
            password: 't',
            email: 'example@com'
        }, {
            username: 'u',
            password: 'testPassword',
            email: 'example@com'
        }, {
            username: 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
            password: 'testPassword',
            email: 'example@com'
        }, {
            username: 'uniqueUser',
            password: 'testPassword',
            classGroup: '123',
            email: 'example@com'
        }, {
            username: 'usernameNew',
            password: 'testPassword',
            email: 'examplecom@'
        }, {
            username: 'usernameNew',
            password: 'testPassword',
            email: ''
        }, {
            username: 'usernameNew',
            password: 'testPassword',
            classGroup: '123',
            email: 'abcdf'
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
        registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[5])
            .expect(400)
        expect(registerResponse.body.error).toContain('Vuosikurssin tule alkaa merkeillä \'C-\'')
        await api
            .post('/api/user/login')
            .send(invalidUsers[5])
            .expect(400)
        registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[6])
            .expect(400)
        expect(registerResponse.body.error).toContain('Sähköpostiosoite on virheellinen.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[6])
            .expect(400)
        registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[7])
            .expect(400)
        expect(registerResponse.body.error).toContain('Sähköpostiosoite on pakollinen.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[7])
            .expect(400)
        registerResponse = await api
            .post('/api/user/register')
            .send(invalidUsers[8])
            .expect(400)
        expect(registerResponse.body.error).toContain('User validation failed: classGroup: Vuosikurssin tule alkaa merkeillä \'C-\'., email: Sähköpostiosoite on virheellinen., username: Käyttäjänimen tulee olla uniikki.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[8])
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})

// "error": "Invalid username or password"