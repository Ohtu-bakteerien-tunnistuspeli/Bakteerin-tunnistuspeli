const router = require('express').Router()
const Bacterium = require('../models/bacterium')
const User = require('../models/user')
const Test = require('../models/testCase')
const Case = require('../models/case')

router.post('/reset_bacteria', async (request, response) => {
    await Bacterium.deleteMany({})
    response.status(204).end()
})

router.post('/reset_users', async (request, response) => {
    await User.deleteMany({})
    response.status(204).end()
})

router.post('/reset_tests', async (request, response) => {
    await Test.deleteMany({})
    response.status(204).end()
})

router.post('/reset_cases', async (request, response) => {
    await Case.deleteMany({})
    response.status(204).end()
})
module.exports = router