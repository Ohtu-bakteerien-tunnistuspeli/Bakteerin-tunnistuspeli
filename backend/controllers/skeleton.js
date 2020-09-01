const skeletonRouter = require('express').Router()

skeletonRouter.get('/', async (request, response) => {
    console.log('message sent')
    response.json({greeting: 'hello world'})
})


module.exports = skeletonRouter