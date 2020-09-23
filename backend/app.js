const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./utils/config')
require('express-async-errors')
const mongoose = require('mongoose')
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)

    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongoServer = new MongoMemoryServer()
    const User = require('./models/user')
    const bcrypt = require('bcrypt')
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
        mongoose.connection.once('open', async () => {
            console.log(`MongoDB successfully connected to ${mongoUri}`)
            const saltRounds = 10
            let passwordHash = await bcrypt.hash('user', saltRounds)
            const user = new User({
                username: 'user',
                admin: false,
                passwordHash
            })
            await user.save()
            passwordHash = await bcrypt.hash('admin', saltRounds)
            const admin = new User({
                username: 'admin',
                admin: true,
                passwordHash
            })
            await admin.save()
        })
    })

} else if (process.env.NODE_ENV === 'production') {
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
} else if (process.env.NODE_ENV === 'test2') {
    console.log('im here for the gh actions')
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
const testRouter = require('./controllers/test')
app.use('/api/test', testRouter)
const caseRouter = require('./controllers/case')
app.use('/api/case', caseRouter)
app.use(security.authorizationHandler)
module.exports = app
