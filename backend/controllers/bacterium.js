const bacteriumRouter = require('express').Router()
const security = require('../utils/security')
/*
const Bacterium = require('../models/bacterium')
*/
/* remove const bacteria ..  when  database is ready */
let bacteria = [{
    id:  1,
    name: 'koli'
    }, 
    {
    id:  2,
    name: 'tetanus'
    },
]

bacteriumRouter.get('/', async (request, response) => {
    //const isSecured = security.verifyToken(request, response)
    const isSecured = true //poista kun kirjautuminen toimii
    if (isSecured) {
      /*
      const backteria = await Bacterium.find({})
      response.json(backteria.map(bacterium => bacterium.toJSON()))
      */
      /* When database is ready remove from here*/
      return response.json(bacteria)
      /*  until here */
    } else {
      throw Error('JsonWebTokenError' )
    }
})

bacteriumRouter.post('/', async (request, response) => {
    //const isSecured = security.verifyToken(request, response)
    const isSecured = true //poista kun kirjautuminen toimii
    if (isSecured) {
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
          id:  bacteria.length +1,
          name: request.body.name
        }
                             
        bacteria.push(newBacterium)
        response.status(201).json(newBacterium)
        /*  until here */
  } else {
    throw Error('JsonWebTokenError' )
  }
})

module.exports = bacteriumRouter