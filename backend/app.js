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
    const Bacterium = require('./models/bacterium')
    const TestCase = require('./models/testCase')
    const Case = require('./models/case')
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

            const initialBacterium = new Bacterium({
                name: 'initial koli'
            })
            await initialBacterium.save()

            const intialTestCase = new TestCase({
                name: 'initial test',
                type: 'type of the initial test'
            })
            await intialTestCase.save()

            const initialCase = new Case({
                name: 'initial case',
                bacterium: initialBacterium,
                anamnesis: 'anamnesis of the initial case',
                completitionText: 'You completed the initial case!',
                samples: [
                    {
                        description: 'this is the right answer',
                        rightAnswer: true
                    },
                    {
                        description: 'this is the wrong answer',
                        rightAnswer: false
                    }
                ],
                testGroups: [
                    [ { test: intialTestCase, isRequired: false, positive: false, alternativeTests: false },{ test: intialTestCase, isRequired: false, positive: false, alternativeTests: false }],
                    [ { test: intialTestCase, isRequired: false, positive: false, alternativeTests: false }]
                ]
            })
            await initialCase.save()

        })
    })

} else if (process.env.NODE_ENV === 'production') {
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
    var mongoDB = 'mongodb://localhost:27017/test'
    mongoose.connect(mongoDB, { useNewUrlParser: true })
    var db = mongoose.connection
    db.on('error', console.error.bind(console, 'MongoDB connection error:'))
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
const testRouter = require('./controllers/testCase')
app.use('/api/test', testRouter)
const caseRouter = require('./controllers/case')
app.use('/api/case', caseRouter)
app.use(security.authorizationHandler)
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(`${__dirname}/build/index.html`, (err) => {
            if (err) {
                res.status(500).send(err)
            }
        })
    })
}
module.exports = app
