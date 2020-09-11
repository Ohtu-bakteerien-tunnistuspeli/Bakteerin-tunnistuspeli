
//const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const { TestScheduler } = require('jest')

const api = supertest(app)

test('login successful', async () => {
    const user = await api
        .post('api/user/login')
        .send({
            username: 'username',
            password: 'password'
        })
        .expect(200)

    await api
        .get('(api/login)')
        .set('Authorization', `bearer ${user.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

})

//afterAll(() => {
//  mongoose.connection.close()
//})