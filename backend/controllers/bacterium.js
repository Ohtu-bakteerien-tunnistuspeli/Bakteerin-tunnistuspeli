const bacteriumRouter = require('express').Router()
const Bacterium = require('../models/bacterium')

bacteriumRouter.get('/', async (request, response) => {
    if (request.user) {
        const backteria = await Bacterium.find({})
        response.json(backteria.map(bacterium => bacterium.toJSON()))
    } else {
        throw Error('JsonWebTokenError')
    }
})

bacteriumRouter.post('/', async (request, response) => {
    if (request.user.admin) {
        try {
            const bacterium = new Bacterium(request.body)
            const savedBacterium = await bacterium.save()
            return response.status(201).json(savedBacterium)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

bacteriumRouter.delete('/:id', async (request, response) => {
    if (request.user.admin) {
        try {
            await Bacterium.findByIdAndDelete(request.params.id)
            response.status(204).end()
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})


bacteriumRouter.put('/:id', async (request, response) => {
    if (request.user.admin) {
        try {
            const updatedBacterium = await Bacterium.findByIdAndUpdate(request.params.id, { name: request.body.name }, { new: true, runValidators: true, context: 'query' })
            return response.status(200).json(updatedBacterium)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})


module.exports = bacteriumRouter