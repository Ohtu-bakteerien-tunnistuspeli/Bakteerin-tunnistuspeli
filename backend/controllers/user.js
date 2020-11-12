const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Credit = require('../models/credit')
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
        .send({
            token,
            username: user.username,
            admin: user.admin,
            classGroup: user.classGroup,
            email: user.email,
            studentNumber: user.studentNumber,
            id: user._id
        })
})

userRouter.post('/register', async (request, response) => {
    const body = request.body

    if (!body.password) {
        return response.status(400).json({ error: 'Salasana on pakollinen.' })
    } else if (body.password.length < 3) {
        return response.status(400).json({ error: 'Salasanan täytyy olla vähintään 3 merkkiä pitkä.' })
    } else if (body.password.length > 100) {
        return response.status(400).json({ error: 'Salasanan täytyy olla enintään 100 merkkiä pitkä.' })
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

userRouter.get('/', async (request, response) => {
    if (request.user && request.user.admin) {
        const users = await User.find({ username: { $ne: request.user.username } })
        response.json(users.map(user => user.toJSON()))
    } else {
        throw Error('JsonWebTokenError')
    }
})

userRouter.delete('/:id', async (request, response) => {
    if (request.user && (request.user.admin || String(request.user.id) === String(request.params.id))) {
        try {
            const userToDelete = await User.findById(request.params.id)
            const creditToDelete = await Credit.findOne({ user: userToDelete })
            await User.findByIdAndRemove(request.params.id)
            if (creditToDelete) {
                await Credit.findByIdAndRemove(creditToDelete.id)
            }
            response.status(204).end()
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

userRouter.put('/:id/promote', async (request, response) => {
    if (request.user && request.user.admin) {
        try {
            const updatedUser = await User.findByIdAndUpdate(request.params.id, { admin: true }, { new: true, runValidators: true, context: 'query' })
            if (!updatedUser) {
                return response.status(400).json({ error: 'Annettua käyttäjää ei löydy tietokannasta.' })
            }
            return response.status(200).json(updatedUser.toJSON())
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

userRouter.put('/:id/demote', async (request, response) => {
    if (request.user && request.user.admin) {
        try {
            const updatedUser = await User.findByIdAndUpdate(request.params.id, { admin: false }, { new: true, runValidators: true, context: 'query' })
            if (!updatedUser) {
                return response.status(400).json({ error: 'Annettua käyttäjää ei löydy tietokannasta.' })
            }
            return response.status(200).json(updatedUser.toJSON())
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

module.exports = userRouter