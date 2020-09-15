const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./utils/config')
require('express-async-errors')
const mongoose = require('mongoose')
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongoServer = new MongoMemoryServer()
    mongoose.Promise = Promise
    mongoServer.getUri().then((mongoUri) => {
        const mongooseOpts = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        mongoose.set('useFindAndModify', false)
        mongoose.set('useCreateIndex', true)
        mongoose.connect(mongoUri, mongooseOpts)
        mongoose.connection.on('error', (e) => {
            if (e.message.code === 'ETIMEDOUT') {
                console.log(e)
                mongoose.connect(mongoUri, mongooseOpts)
            }
            console.log(e)
        })
        mongoose.connection.once('open', () => {
            console.log(`MongoDB successfully connected to ${mongoUri}`)
        })
    })

} else if (process.env.NODE_ENV === 'production' ){
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
}
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
const security = require('./utils/security')
app.use(security.tokenExtractor)
const skeletonRouter = require('./controllers/skeleton')
app.use('/api/skeleton', skeletonRouter)
const userRouter = require('./controllers/user')
app.use('/api/user', userRouter)
const bacteriumRouter = require('./controllers/bacterium')
app.use('/api/bacteria', bacteriumRouter)
app.use(security.authorizationHandler)
module.exports = app