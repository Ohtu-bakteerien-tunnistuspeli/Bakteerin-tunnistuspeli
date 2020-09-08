const skeletonRouter = require('express').Router()
const security = require('../utils/security')
skeletonRouter.get('/', async (request, response) => {
    console.log('message sent')
    response.json({ greeting: 'hello world' })
})

skeletonRouter.get('/secured', async (request, response) => {
    const securityResponse = security.verifyToken(request, response)
    if (securityResponse.isSecured) {
        return response.json({ greeting: 'hello world' })
    } else {
        return securityResponse.response
    }
})

module.exports = skeletonRouter