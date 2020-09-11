const skeletonRouter = require('express').Router()
skeletonRouter.get('/', async (request, response) => {
    console.log('message sent')
    response.json({ greeting: 'hello world' })
})

skeletonRouter.get('/secured', async (request, response) => {
    if(request.token) {
        return response.json({ greeting: 'hello world' })
    } else {
        throw Error('JsonWebTokenError' )
    }
})

module.exports = skeletonRouter