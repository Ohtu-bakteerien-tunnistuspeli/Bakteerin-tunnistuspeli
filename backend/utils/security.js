const config = require('./config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        let token = authorization.substring(7)
        token = token ? jwt.verify(token, config.SECRET) : null
        request.user = await User.findById(token.id)
    } else {
        request.user = null
    }
    next()
}

const authorizationHandler = (error, request, response, next) => {
    if (error.name === 'JsonWebTokenError' || !request.isSecured) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    next(error)
}

module.exports = {
    tokenExtractor,
    authorizationHandler
}