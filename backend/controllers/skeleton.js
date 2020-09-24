const Skeleton = require('../models/skeleton')
const skeletonRouter = require('express').Router()

skeletonRouter.post('/add_skel', async (req, res) => {
    try {
        const skel = new Skeleton(req.body)
        const savedSkel = await skel.save()
        return res.status(201).json(savedSkel)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

skeletonRouter.get('/', async (request, response) => {
    console.log('message sent')
    response.json({ greeting: 'hello world' })
})

skeletonRouter.get('/secured', async (request, response) => {
    if(request.user) {
        return response.json({ greeting: 'hello world' })
    } else {
        throw Error('JsonWebTokenError' )
    }
})

module.exports = skeletonRouter