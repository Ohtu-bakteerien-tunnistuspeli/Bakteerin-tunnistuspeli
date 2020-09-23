const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Bacterium = require('../models/bacterium')
const User = require('../models/user')
const Test = require('../models/testCase')


const initialBacteria = [{
    name: 'koli'
},
{
    name: 'tetanus'
}]
const initialTest = {
    name: 'testName',
    type: 'testType'
}

beforeEach(async () => {
    await Bacterium.deleteMany({})
    await User.deleteMany({})
    await Test.deleteMany({})
    const bacteriaObjects = initialBacteria.map(bacterium => new Bacterium(bacterium))
    const promiseArray = bacteriaObjects.map(backterium => backterium.save())
    await Promise.all(promiseArray)
    const adminPassword = await bcrypt.hash('admin', 10)
    const userPassword = await bcrypt.hash('password', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true })
    const user = new User({ username: 'usernameNew', passwordHash: userPassword, admin: false })
    await admin.save()
    await user.save()
    await Test(initialTest).save()
})
