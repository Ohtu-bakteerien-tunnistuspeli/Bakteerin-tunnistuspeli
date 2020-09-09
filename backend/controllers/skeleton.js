const skeletonRouter = require('express').Router()
const security = require('../utils/security')
skeletonRouter.get('/', async (request, response) => {
    console.log('message sent')
    response.json({ greeting: 'hello world' })
})

skeletonRouter.get('/secured', async (request, response) => {
    const isSecured = security.verifyToken(request, response)
    if (isSecured) {
        return response.json({ greeting: 'hello world' })
    } else {
        throw Error('JsonWebTokenError' )
    }
})

module.exports = skeletonRouter