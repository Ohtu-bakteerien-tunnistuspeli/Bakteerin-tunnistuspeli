const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('database connection', () => {
    test('is working with skeleton', async () => {
        const newSkel = {
            name: 'testing skeletar'
        }
        await api
            .post('/api/skeleton/add_skel')
            .send(newSkel)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
})