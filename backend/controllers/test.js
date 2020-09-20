const testRouter = require('express').Router()
const Test = require('../models/test')

testRouter.get('/testiLista', async (request, response) => {
    console.log('ei päästy if lauseen sisään')
    if (request.user) {
        const test = await Test.find({})
        console.log('päästiin tänne asti')
        response.json(test.map(test => test.toJSON()))
    } else {
        throw Error('JsonWebTokenError')
    }
})

module.exports = testRouter