const bacteriumRouter = require('express').Router()
/*
const Bacterium = require('../models/bacterium')
*/
/* remove const bacteria ..  when  database is ready */
let bacteria = [{
    id: 1,
    name: 'koli'
},
{
    id: 2,
    name: 'tetanus'
},
]

bacteriumRouter.get('/', async (request, response) => {
    if (request.token) {
        /*
      const backteria = await Bacterium.find({})
      response.json(backteria.map(bacterium => bacterium.toJSON()))
      */
        /* When database is ready remove from here*/
        return response.json(bacteria)
        /*  until here */
    } else {
        throw Error('JsonWebTokenError')
    }
})

bacteriumRouter.post('/', async (request, response) => {
    if (request.token) {
        /*
        try {
          const bacterium = new Bacterium(request.body)
          const savedBacterium = await bacterium.save()
          return response.status(201).json(savedBacterium)
        } catch (error) {
          return response.status(400).json({ error: error.message })
        }
        */
        /* When database is ready remove from here*/
        const newBacterium = {
            id: bacteria.length + 1,
            name: request.body.name
        }
        bacteria.push(newBacterium)
        response.status(201).json(newBacterium)
        /*  until here */
    } else {
        throw Error('JsonWebTokenError')
    }
})

bacteriumRouter.delete('/:id', async (request, response) => {
    if (request.token) {
        /*
        try {
          await Bacterium.findByIdAndRemove(request.params.id)
          response.status(204).end()
        } catch (error) {
          return response.status(400).json({ error: error.message })
        }
        */
        /* When database is ready remove from here*/
        const id = Number(request.params.id)
        bacteria = bacteria.filter(b => b.id !== id)
        response.status(204).end()
        /*  until here */
    } else {
        throw Error('JsonWebTokenError')
    }
})


bacteriumRouter.put('/:id', async (request, response) => {
    if (request.token) {
        /*
        try {
            const updatedBacterium = await Bacterium.findByIdAndUpdate(request.params.id, { name: request.body.name }, { new: true })
            return response.status(200).json(updatedBacterium)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
        */
        /* When database is ready remove from here*/
        const index = bacteria.findIndex(bacterium => bacterium.id === Number(request.params.id))
        bacteria[index].name = request.body.name
        response.status(200).json(bacteria[index])
        /*  until here */
    } else {
        throw Error('JsonWebTokenError')
    }
})


module.exports = bacteriumRouter