const creditRouter = require('express').Router()
const Credit = require('../models/credit')

creditRouter.get('/', async (request, response) => {
    if (request.user && request.user.admin) {
        const credits = await Credit.find({}).populate('user')
        response.json(credits.map(credit => credit.toJSON()))
    }
    else {
        throw Error('JsonWebTokenError')
    }
})

module.exports = creditRouter