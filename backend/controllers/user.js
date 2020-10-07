const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

userRouter.post('/login', async (request, response) => {
    const body = request.body
    const user = await User.findOne({ username: body.username })
    try {
        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(body.password, user.passwordHash)
        if (!(user && passwordCorrect)) {
            return response.status(400).json({
                error: 'Invalid username or password'
            })
        }
    } catch (error) {
        return response.status(400).json({
            error: 'Invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }
    const token = jwt.sign(userForToken, config.SECRET)
    response
        .status(200)
        .send({ token, username: user.username, admin: user.admin })
})

userRouter.post('/register', async (request, response) => {
    const body = request.body

    if (!body.password) {
        return response.status(400).json({ error: 'Salasana on pakollinen.' })
    } else if (body.password.length < 3) {
        return response.status(400).json({ error: 'Salasanan täytyy olla vähintään 3 merkkiä pitkä.' })
    } else {
        try {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(body.password, saltRounds)
            const user = new User({
                username: body.username,
                passwordHash: passwordHash,
                admin: false,
                classGroup: body.classGroup,
                email: body.email,
                studentNumber: body.studentNumber
            })
            await user.save()
            return response.status(200).send()
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    }
})

module.exports = userRouter