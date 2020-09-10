//const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('bacteria are returned as json', async () => {
    const user = await api
        .post('/api/user/login')
        .send({
            username: 'username',
            password: 'password'
        })
        .expect(200)

    const result = await api
        .get('/api/bacteria')
        .set('Authorization', `bearer ${user.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})