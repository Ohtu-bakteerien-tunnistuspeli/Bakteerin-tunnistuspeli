
//const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const { TestScheduler } = require('jest')

const api = supertest(app)

test('login successfull', async () => {
    const user = await api //eslint-disable-line
        .post('/api/user/login')
        .send({
            username: 'username',
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

//afterAll(() => {
//  mongoose.connection.close()
//})

// "error": "Invalid username or password"