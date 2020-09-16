const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const { TestScheduler } = require('jest')

const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.remove({})
    const adminPassword = await bcrypt.hash('admin', 10)
    const userPassword = await bcrypt.hash('password', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true })
    const user = new User({ username: 'usernameNew', passwordHash: userPassword, admin: false })
    await admin.save()
    await user.save()
})

test('login successfull', async () => {
    const user = await api //eslint-disable-line
        .post('/api/user/login')
        .send({
            username: 'usernameNew',
            password: 'password'
        })
        .expect(200)

})

test('failed login', async () => {
    const user = await api //eslint-disable-line
        .post('/api/user/login')
        .send({
            username: 'user',
            password: 'pass'
        })
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})
