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
    await Bacterium.deleteMany({})
    await User.deleteMany({})
    const bacteriaObjects = initialBacteria.map(bacterium => new Bacterium(bacterium))
    const promiseArray = bacteriaObjects.map(backterium => backterium.save())
    await Promise.all(promiseArray)
    const adminPassword = await bcrypt.hash('admin', 10)
    const userPassword = await bcrypt.hash('password', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true })
    const user = new User({ username: 'usernameNew', passwordHash: userPassword, admin: false })
    await admin.save()
    await user.save()
})

describe('bacteria format', () => {
    test('bacteria are returned as json', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })
            .expect(200)
        await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

describe('addition of a bacterium ', () => {
    test('admin can add a bacterium', async () => {
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

    test('an invalid bacterium is not added and returns error message', async () => {
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
        const newBacteria = [{
            name: 'a'
        },
        {
            name: 'koli'
        },
        {
            name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }]
        let addResponse = await api
            .post('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newBacteria[0])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toContain('Bakteerin nimen tulee olla vähintään 2 merkkiä pitkä.')
        let resAfterAdding = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
        addResponse = await api
            .post('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newBacteria[1])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toContain('Bakteerin nimen tulee olla uniikki.')
        resAfterAdding = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
        addResponse = await api
            .post('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newBacteria[2])
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toContain('Bakteerin nimen tulee olla enintään 100 merkkiä pitkä.')
        resAfterAdding = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
    })

    test('user cannot add a bacterium', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
        const res = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
        const initialLength = res.body.length
        const newBacterium = {
            name: 'testing bacterium'
        }
        const addResponse = await api
            .post('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
            .send(newBacterium)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(addResponse.body.error).toEqual('token missing or invalid')
        const resAfterAdding = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterAdding.body).toHaveLength(initialLength)
    })
})
describe('deletion of a bacterium', () => {
    test('admin can delete a bacterium', async () => {
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
        await api
            .delete(`/api/bacteria/${resAfterAdding.body[0].id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(204)
        const resAfterDelete = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterDelete.body).toHaveLength(initialLength)
    })

    test('user cannot delete a bacterium', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })
        const res = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
        const initialLength = res.body.length
        const deleteResponse = await api
            .delete(`/api/bacteria/${res.body[0].id}`)
            .set('Authorization', `bearer ${user.body.token}`)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(deleteResponse.body.error).toEqual('token missing or invalid')
        const resAfterDelete = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)
        expect(resAfterDelete.body).toHaveLength(initialLength)
    })
})

describe('modify a bacterium', () => {
    test('admin can modify an existing bacterium', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })

        const res = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)

        const bacteriumToUpdate = res.body[0]
        bacteriumToUpdate.name = 'Bakteeri'
        const updatedBacterium = await api
            .put(`/api/bacteria/${ bacteriumToUpdate.id }`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(bacteriumToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(bacteriumToUpdate.id).toEqual(updatedBacterium.body.id)
        expect(updatedBacterium.body.name).toEqual('Bakteeri')

    })
    test('user cannot modify an existing bacterium', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'usernameNew',
                password: 'password'
            })

        const res = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)

        const bacteriumToUpdate = res.body[0]
        bacteriumToUpdate.name = 'Bakteeri'
        const updatetBacterium = await api
            .put(`/api/bacteria/${ bacteriumToUpdate.id }`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(bacteriumToUpdate)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(updatetBacterium.body.error).toEqual('token missing or invalid')
    })
    test('if name is not unique, error is returned', async () => {
        const user = await api
            .post('/api/user/login')
            .send({
                username: 'adminNew',
                password: 'admin'
            })

        const bacteriaList = await api
            .get('/api/bacteria')
            .set('Authorization', `bearer ${user.body.token}`)

        const bacteriumToUpdate = bacteriaList.body[0]
        bacteriumToUpdate.name = 'tetanus'
        const updatedBacterium = await api
            .put(`/api/bacteria/${ bacteriumToUpdate.id }`)
            .set('Authorization', `bearer ${user.body.token}`)
            .send(bacteriumToUpdate)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(updatedBacterium.body.error).toContain('Bakteerin nimen tulee olla uniikki.')
    })
})
afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})
