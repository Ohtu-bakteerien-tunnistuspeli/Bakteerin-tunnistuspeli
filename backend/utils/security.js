const config = require('./config')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
        request.token = request.token ? jwt.verify(request.token, config.SECRET) : null
    } else {
        request.token = null
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