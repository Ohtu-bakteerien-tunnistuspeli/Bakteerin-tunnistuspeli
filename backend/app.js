const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
const skeletonRouter = require('./controllers/skeleton')
app.use('/api/skeleton', skeletonRouter)
module.exports = app