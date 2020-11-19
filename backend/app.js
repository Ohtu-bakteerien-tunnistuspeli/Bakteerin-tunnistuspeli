const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./utils/config')
require('express-async-errors')
const mongoose = require('mongoose')
if (process.env.NODE_ENV === 'testserver' || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const generateData = true
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongoServer = new MongoMemoryServer()
    const User = require('./models/user')
    const Bacterium = require('./models/bacterium')
    const TestCase = require('./models/testCase')
    const Case = require('./models/case')
    const Credit = require('./models/credit')
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
                email: 'examples@com',
                admin: false,
                studentNumber: '834183479234',
                classGroup: 'C-13',
                passwordHash
            })
            await user.save()
            passwordHash = await bcrypt.hash('admin', saltRounds)
            const admin = new User({
                username: 'admin',
                email: 'example@com',
                studentNumber: '',
                classGroup: '',
                admin: true,
                passwordHash
            })
            await admin.save()

            const cred1 = new Credit({
                user: user,
                testCases: [
                    'Maitotila 3',
                    'Maitotila 5'
                ]
            })
            await cred1.save()

            const bac1 = new Bacterium({
                name: 'Streptococcus agalactiae'
            })

            const bac2 = new Bacterium({
                name: 'Staphylococcus aureus'
            })

            await bac1.save()
            await bac2.save()

            const intialTestCase1 = new TestCase({
                name: 'Veriagar, +37 °C, aerobinen kasvatus',
                type: 'Viljely'
            })

            const intialTestCase2 = new TestCase({
                name: 'Gram-värjäys',
                type: 'Värjäys'
            })

            const intialTestCase3 = new TestCase({
                name: 'Katalaasitesti',
                type: 'Testi'
            })
            const intialTestCase4 = new TestCase({
                name: 'HIRS-sarja (hippuraatti, inuliini, raffinoosi, sorbitoli)',
                type: 'Testi'
            })

            const intialTestCase5 = new TestCase({
                name: 'Eskuliiniveriagar',
                type: 'Viljely'
            })

            const intialTestCase6 = new TestCase({
                name: 'Edwardsin agar',
                type: 'Viljely'
            })

            const intialTestCase7 = new TestCase({
                name: 'CAMP-testi',
                type: 'Testi'
            })

            await intialTestCase1.save()
            await intialTestCase2.save()
            await intialTestCase3.save()
            await intialTestCase4.save()
            await intialTestCase5.save()
            await intialTestCase6.save()
            await intialTestCase7.save()

            const initialCase = new Case({
                name: 'Maitotila 1',
                bacterium: bac1,
                anamnesis: 'Vasemman takaneljänneksen maito on hiukan kokkareista...',
                completionText: 'You completed the initial case!',
                hints: [],
                samples: [
                    {
                        description: 'Maitonäyte Muurikin kaikista neljänneksistä',
                        rightAnswer: true
                    },
                    {
                        description: 'Tankkimaitonäyte',
                        rightAnswer: false
                    },
                    {
                        description: 'Ulostenäyte Muurikilta',
                        rightAnswer: false
                    },
                    {
                        description: 'Virtsanäyte Muurikilta',
                        rightAnswer: false
                    }
                ],
                testGroups: [
                    [{ tests: [{ test: intialTestCase1, positive: true }], isRequired: false }, { tests: [{ test: intialTestCase2, positive: true }, { test: intialTestCase4, positive: true }], isRequired: true }],
                    [{ tests: [{ test: intialTestCase3, positive: false }], isRequired: true }]
                ],
                complete: true
            })
            await initialCase.save()

            if (generateData) {
                const usersToGenerate = 2000
                const classGroupsStart = 50
                const classGroupsEnd = 70
                const saltRounds = 10
                const passwordHash = await bcrypt.hash('passwordForAllAccounts10', saltRounds)

                let classGroups = []
                let cases = [
                    'Maatila',
                    'Maitotila 1',
                    'Maitotila 2',
                    'Maitotila 3'
                ]
                for (let i = classGroupsStart; i <= classGroupsEnd; i++) {
                    classGroups.push(`C-${i}`)
                }

                let generatedUsers = []
                for (let i = 0; i < usersToGenerate; i++) {
                    const userNumberStr = `${10000 + Math.floor(Math.random() * 1000)}${i}`
                    const user = new User({
                        username: `user${userNumberStr}`,
                        email: `example${userNumberStr}@com`,
                        studentNumber: userNumberStr,
                        classGroup: classGroups[Math.floor(Math.random() * classGroups.length)],
                        admin: false,
                        passwordHash
                    })
                    generatedUsers.push(user)
                }
                const userPromiseArray = generatedUsers.map(user => user.save())
                await Promise.all(userPromiseArray)

                let generatedCredits = []
                for (let i = 0; i < generatedUsers.length; i++) {
                    const user = generatedUsers[i]
                    let testCases = []

                    for (let i = 0; i < cases.length; i++) {
                        if (Math.random() < 0.5) {
                            testCases.push(cases[i])
                        }
                    }
                    if (testCases.length > 0) {
                        const credit = new Credit({
                            user: user,
                            testCases: testCases
                        })
                        generatedCredits.push(credit)
                    }
                }
                const creditPromiseArray = generatedCredits.map(credit => credit.save())
                await Promise.all(creditPromiseArray)

                console.log('Data generated')
            }
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
const path = require('path')
const dir = path.join(__dirname, config.IMAGEURL)
console.log(dir)
app.use(express.static(dir))
const path2 = require('path')
let dir2 = path2.join(__dirname, '/lib')
console.log(dir2)
app.use(express.static(dir2))
const security = require('./utils/security')
app.use(security.tokenExtractor)
const userRouter = require('./controllers/user')
app.use('/api/user', userRouter)
const bacteriumRouter = require('./controllers/bacterium')
app.use('/api/bacteria', bacteriumRouter)
const testRouter = require('./controllers/testCase')
app.use('/api/test', testRouter)
const caseRouter = require('./controllers/case')
app.use('/api/case', caseRouter)
const gameRouter = require('./controllers/game')
app.use('/api/game', gameRouter)
const creditRouter = require('./controllers/credit')
app.use('/api/credit', creditRouter)
app.use(security.authorizationHandler)
app.get(/\/(bakteeriLista|tapausLista|testiLista|suoritusLista|kayttajaLista|peli|profiilini|kirjautuminen|rekisteroityminen|kertakayttoinensalasana)$/, (req, res) => {
    res.sendFile(`${__dirname}/build/index.html`, (err) => {
        if (err) {
            res.status(500).send(err)
        }
    })
})
app.get('*', (req, res) => {
    res.status(404).sendFile(`${__dirname}/utils/error.html`)
})
module.exports = app
