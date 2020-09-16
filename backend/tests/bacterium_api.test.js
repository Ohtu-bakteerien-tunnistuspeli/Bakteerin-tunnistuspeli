const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Bacterium = require('../models/bacterium')
const User = require('../models/user')

const initialBacteria = [{
    name: 'koli'
},
{
    name: 'tetanus'
}]

beforeEach(async () => {
    await Bacterium.remove({})
    await User.remove({})
    const bacteriaObjects = initialBacteria.map(bacterium => new Bacterium(bacterium))
    const promiseArray = bacteriaObjects.map(backterium => backterium.save())
    await Promise.all(promiseArray)
    const adminPassword = await bcrypt.hash('admin', 10)
    const userPassword = await bcrypt.hash('password', 10)
    const admin = new User({username: 'adminNew', passwordHash: adminPassword, admin: true})
    const user = new User({username: 'usernameNew', passwordHash: userPassword, admin: false})
    await admin.save()
    await user.save()
})
describe ("bacteria format", () => {
    test('bacteria are returned as json', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
            .expect(200)

        console.log('täällä')
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
                username: 'adminNew',
                password: 'admin'
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

        expect(resAfterAdding.body).toHaveLength(initialLength + 1)
    })
})
afterAll(() => {
    mongoose.connection.close()
})
