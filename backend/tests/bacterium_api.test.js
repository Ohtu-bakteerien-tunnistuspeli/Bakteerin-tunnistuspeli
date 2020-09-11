//const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

//const Bacterium = require('../models/bacterium')
/*
const initialBacteria = [{
    name: 'koli'
},
{
    name: 'tetanus'
}]
*/
beforeEach(async () => {
    //await Bacterium.deleteMany({})
    //let bacteriumObj = new Bacterium(initialBacteria[0])
    //await bacteriumObj.save()
    //bacteriumObj = new Bacterium(initialBacteria[1])
    //await bacteriumObj.save()
})

test('bacteria are returned as json', async () => {
    const user = await api
        .post('/api/user/login')
        .send({
            username: 'username',
            password: 'password'
        })
        .expect(200)

    await api
        .get('/api/bacteria')
        .set('Authorization', `bearer ${user.body.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('user can add a bacterium', async () => {

    const user = await api
        .post('/api/user/login')
        .send({
            username: 'username',
            password: 'password'
        })

    const res = await api
        .get('/api/bacteria')
        .set('Authorization', `bearer ${user.body.token}`)

    const initialLength = res.body.length

    const newBacterium = {
        name: 'testing bacterium'
    }

    await api
        .post('/api/bacteria')
        .set('Authorization', `bearer ${user.body.token}`)
        .send(newBacterium)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const resAfterAdding = await api
        .get('/api/bacteria')
        .set('Authorization', `bearer ${user.body.token}`)

    expect(resAfterAdding.body).toHaveLength(initialLength+1)
})
/*
afterAll(() => {
    mongoose.connection.close()
  })
  */