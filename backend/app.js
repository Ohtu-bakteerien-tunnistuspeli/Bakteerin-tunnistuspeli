const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
const security = require('./utils/security')
app.use(security.tokenExtractor)
const skeletonRouter = require('./controllers/skeleton')
app.use('/api/skeleton', skeletonRouter)
const userRouter = require('./controllers/user')
app.use('/api/user', userRouter)

module.exports = app