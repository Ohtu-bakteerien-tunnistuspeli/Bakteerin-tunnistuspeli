const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const Credit = require('../models/credit')
const config = require('../utils/config')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const validation = config.validation.user

userRouter.post('/login', async (request, response) => {
    const body = request.body
    const user = await User.findOne({ username: body.username })
    let singleUsePasswordUsed = false
    try {
        if (!user) {
            return response.status(400).json({
                error: 'Invalid username or password'
            })
        }
        let passwordCorrect = await bcrypt.compare(body.password, user.passwordHash)
        if (!passwordCorrect && user.singleUsePassword) {
            const diffTime = Math.abs(new Date() - user.singleUsePassword.generationTime)
            if (diffTime <= 900000) {
                passwordCorrect = await bcrypt.compare(body.password, user.singleUsePassword.passwordHash)
                singleUsePasswordUsed = true
            }
            await User.findByIdAndUpdate(user.id, { singleUsePassword: null }, { new: true, runValidators: true, context: 'query' })
        }
        if (!passwordCorrect) {
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
            id: user._id,
            singleUsePasswordUsed
        })
})

userRouter.post('/register', async (request, response) => {
    const body = request.body
    if (!body.password) {
        return response.status(400).json({ error: validation.password.requiredMessage })
    } else if (body.password.length < validation.password.minlength) {
        return response.status(400).json({ error: validation.password.minMessage })
    } else if (body.password.length > validation.password.maxlength) {
        return response.status(400).json({ error: validation.password.maxMessage })
    } else if (body.password === body.username ||
        body.password === body.classGroup ||
        body.password === body.email ||
        body.password === body.newStudentNumber) {
        return response.status(400).json({ error: validation.password.uniqueMessage })
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

userRouter.post('/singleusepassword', async (request, response) => {
    const user = await User.findOne({ username: request.body.username })
    if (user && user.email === request.body.email) {
        try {
            let transporter
            if (config.EMAILHOST.includes('outlook')) {
                transporter = nodemailer.createTransport({
                    host: config.EMAILHOST,
                    port: config.EMAILPORT,
                    secure: false,
                    tls: {
                        ciphers: 'SSLv3'
                    },
                    auth: {
                        user: config.EMAILUSER,
                        pass: config.EMAILPASSWORD,
                    },
                })
            } else if (config.EMAILHOST.includes('helsinki')) {
                transporter = nodemailer.createTransport({
                    from: config.EMAILUSER,
                    host: config.EMAILHOST,
                    port: config.EMAILPORT,
                    secure: false
                })
            } else {
                transporter = nodemailer.createTransport({
                    host: config.EMAILHOST,
                    port: config.EMAILPORT,
                    secure: true,
                    auth: {
                        user: config.EMAILUSER,
                        pass: config.EMAILPASSWORD,
                    },
                })
            }
            const singleUsePassword = uuidv4()
            await transporter.sendMail({
                from: config.EMAILUSER,
                to: user.email,
                subject: 'Bakteeripelin kertakäyttöinen salasana',
                text: `Kertakäyttöinen salasanasi on "${singleUsePassword}". Salasana vanhentuu 15min kuluttua.`,
                html: `<p>Kertakäyttöinen salasanasi on "<span style="color: black; background: black; span:hover { color: white }">${singleUsePassword}</span>". Salasana vanhentuu 15min kuluttua.</p>`,
            })
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(singleUsePassword, saltRounds)
            await User.findByIdAndUpdate(user.id, { singleUsePassword: { passwordHash, generationTime: new Date() } }, { new: true, runValidators: true, context: 'query' })
        } catch (error) {
            return response.status(400).json({ error: 'Sähköpostia ei voitu lähettää.' })
        }
        return response.status(200).json({ message: `Kertakäyttöinen salasana lähetetty sähöpostiosoitteeseen ${user.email}.` })
    } else {
        return response.status(400).json({ error: 'Käyttäjää ei löytynyt tai sähköposti on väärä.' })
    }
})

userRouter.put('/', async (request, response) => {
    if (request.user) {
        const body = request.body
        if (!body.password) {
            return response.status(400).json({ error: 'Salasana on pakollinen.' })
        } else {
            try {
                const user = await User.findOne({ username: request.user.username })
                const passwordCorrect = user === null
                    ? false
                    : await bcrypt.compare(body.password, user.passwordHash)
                if (passwordCorrect) {
                    let changes = {}

                    if (body.newUsername) {
                        changes = { ...changes, username: body.newUsername }
                    }

                    if (body.newEmail) {
                        changes = { ...changes, email: body.newEmail }
                    }

                    if (body.newPassword) {
                        if (body.newPassword.length < validation.password.minlength) {
                            return response.status(400).json({ error: validation.password.minMessage })
                        } else if (body.newPassword.length > validation.password.maxlength) {
                            return response.status(400).json({ error: validation.password.maxMessage })
                        } else {
                            const saltRounds = 10
                            const passwordHash = await bcrypt.hash(body.newPassword, saltRounds)
                            changes = { ...changes, passwordHash: passwordHash }
                        }
                    }

                    if (body.newStudentNumber) {
                        changes = { ...changes, studentNumber: body.newStudentNumber }
                    }

                    if (body.newClassGroup) {
                        changes = { ...changes, classGroup: body.newClassGroup }
                    }

                    const updatedUser = await User.findByIdAndUpdate(user.id, changes, { new: true, runValidators: true, context: 'query' })
                    if (!updatedUser) {
                        return response.status(400).json({ error: 'Annettua käyttäjää ei löydy tietokannasta.' })
                    }
                    return response.status(200).json(updatedUser.toJSON())
                } else {
                    return response.status(400).json({ error: 'Väärä salasana.' })
                }
            } catch (error) {
                return response.status(400).json({ error: error.message })
            }
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

module.exports = userRouter
