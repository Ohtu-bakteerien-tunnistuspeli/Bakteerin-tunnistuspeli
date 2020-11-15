
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Credit = require('../models/credit')
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
    test('valid user with compulsory fields can register', async () => {
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
        expect(registerResponse.body.error).toContain('User validation failed: classGroup: Vuosikurssin tule alkaa merkeillä \'C-\' ja loppua lukuun., email: Sähköpostiosoite on virheellinen., username: Käyttäjänimen tulee olla uniikki.')
        await api
            .post('/api/user/login')
            .send(invalidUsers[8])
            .expect(400)
    })
})

describe('getting users', () => {
    test('users are returned as array', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
            .expect(200)
        const usersRes = await api
            .get('/api/user')
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(usersRes.body.length).toEqual(1)
    })

    test('returned users do not contain one getting them', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
            .expect(200)
        const usersRes = await api
            .get('/api/user')
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const users = usersRes.body.map(listUser => listUser.username)
        expect(users).not.toContain('adminNew')
        expect(users).toContain('usernameNew')
    })

    test('user cannot get users', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        await api
            .get('/api/user')
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
})

describe('delete', () => {
    test('user can delete itself', async () => {
        const user = await User.findOne({ username: 'usernameNew' })
        const loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        await api
            .delete(`/api/user/${user.id}`)
            .set('Authorization', `bearer ${loggedUser.body.token}`)
            .expect(204)
        await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(400)
    })

    test('user cannot delete others', async () => {
        const userPassword = await bcrypt.hash('password2', 10)
        let user = new User({ username: 'usernameNew2', passwordHash: userPassword, admin: false, email: 'example@com' })
        await user.save()
        user = await User.findOne({ username: 'usernameNew2' })
        await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew2',
                password: 'password2'
            })
            .expect(200)
        const loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        await api
            .delete(`/api/user/${user.id}`)
            .set('Authorization', `bearer ${loggedUser.body.token}`)
            .expect(401)
        await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew2',
                password: 'password2'
            })
            .expect(200)
    })

    test('admin can delete user', async () => {
        const user = await User.findOne({ username: 'usernameNew' })
        await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        const admin = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        await api
            .delete(`/api/user/${user.id}`)
            .set('Authorization', `bearer ${admin.body.token}`)
            .expect(204)
        await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(400)
    })

    test('deleting user deletes its credits', async () => {
        const user = await User.findOne({ username: 'usernameNew' })
        await Credit({ user, testCases: [] }).save()
        let credit = await Credit.findOne({ user })
        expect(credit).toBeDefined()
        const loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        await api
            .delete(`/api/user/${user.id}`)
            .set('Authorization', `bearer ${loggedUser.body.token}`)
            .expect(204)
        credit = await Credit.findOne({ user })
        expect(credit).toBeNull()
    })
})

describe('promote', () => {
    test('admin can promote user', async () => {
        const user = await User.findOne({ username: 'usernameNew' })
        let loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        expect(loggedUser.body.admin).toBeFalsy()
        const admin = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        await api
            .put(`/api/user/${user.id}/promote`)
            .set('Authorization', `bearer ${admin.body.token}`)
            .expect(200)
        loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        expect(loggedUser.body.admin).toBeTruthy()
    })

    test('admin cannot promote non existing user', async () => {
        const admin = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        await api
            .put('/api/user/does not exist/promote')
            .set('Authorization', `bearer ${admin.body.token}`)
            .expect(400)
    })

    test('user cannot promote', async () => {
        const user = await User.findOne({ username: 'usernameNew' })
        let loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        expect(loggedUser.body.admin).toBeFalsy()
        await api
            .put(`/api/user/${user.id}/promote`)
            .set('Authorization', `bearer ${loggedUser.body.token}`)
            .expect(401)
        loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        expect(loggedUser.body.admin).toBeFalsy()
    })
})

describe('demote', () => {
    test('admin can demote user', async () => {
        await User.findOneAndUpdate({ username: 'usernameNew' }, { admin: true })
        const user = await User.findOne({ username: 'usernameNew' })
        let loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        expect(loggedUser.body.admin).toBeTruthy()
        const admin = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        await api
            .put(`/api/user/${user.id}/demote`)
            .set('Authorization', `bearer ${admin.body.token}`)
            .expect(200)
        loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        expect(loggedUser.body.admin).toBeFalsy()
    })

    test('admin cannot demote non existing user', async () => {
        const admin = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        await api
            .put('/api/user/does not exist/demote')
            .set('Authorization', `bearer ${admin.body.token}`)
            .expect(400)
    })

    test('user cannot demote', async () => {
        const user = await User.findOne({ username: 'adminNew' })
        let loggedUser = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        let admin = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        expect(admin.body.admin).toBeTruthy()
        await api
            .put(`/api/user/${user.id}/promote`)
            .set('Authorization', `bearer ${loggedUser.body.token}`)
            .expect(401)
        admin = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
        expect(admin.body.admin).toBeTruthy()
    })
})

describe('changing password', () => {
    test('admin can change own password', async () => {
        const loginResponse = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
            .expect(200)
        await api
            .post('/api/user/changePassword')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .send({ password: 'admin', newPassword: 'newAdmin' })
            .expect(200)
        await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'newAdmin'
            })
            .expect(200)
    })

    test('user can change own password', async () => {
        const loginResponse = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        await api
            .post('/api/user/changePassword')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .send({ password: 'password', newPassword: 'newPassword' })
            .expect(200)
        await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'newPassword'
            })
            .expect(200)
    })

    test('password is required', async () => {
        const loginResponse = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        const res = await api
            .post('/api/user/changePassword')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .send({ newPassword: 'newPassword' })
            .expect(400)
        expect(res.body.error).toContain('Salasana on pakollinen.')
    })

    test('new password is required', async () => {
        const loginResponse = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        const res = await api
            .post('/api/user/changePassword')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .send({ password: 'password' })
            .expect(400)
        expect(res.body.error).toContain('Uusi salasana on pakollinen.')
    })

    test('new password needs to be long enough', async () => {
        const loginResponse = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        const res = await api
            .post('/api/user/changePassword')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .send({ password: 'password', newPassword: 'uu' })
            .expect(400)
        expect(res.body.error).toContain('Salasanan täytyy olla vähintään 3 merkkiä pitkä.')
    })

    test('new password cannot be too long', async () => {
        const loginResponse = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        const res = await api
            .post('/api/user/changePassword')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .send({ password: 'password', newPassword: new Array(150).join('a') })
            .expect(400)
        expect(res.body.error).toContain('Salasanan täytyy olla enintään 100 merkkiä pitkä.')
    })

    test('password is not changed if incorrect password is given', async () => {
        const loginResponse = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
            .expect(200)
        const res = await api
            .post('/api/user/changePassword')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .send({ password: 'pass', newPassword: 'newPassword' })
            .expect(400)
        expect(res.body.error).toContain('Väärä salasana.')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})

// "error": "Invalid username or password"