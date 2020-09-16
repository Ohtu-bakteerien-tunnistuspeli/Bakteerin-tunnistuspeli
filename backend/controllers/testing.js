const router = require('express').Router()
const Bacterium = require('../models/bacterium')
const User = require('../models/user')

router.post('/reset_bacteria', async (request, response) => {
    await Bacterium.deleteMany({})
    response.status(204).end()
})

router.post('/reset_users', async (request, response) => {
    await User.deleteMany({})
    response.status(204).end()
})

module.exports = router