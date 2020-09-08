const config = require('./config')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    } else {
        request.token = null
    }
    next()
}

const verifyToken = (request, response) => {
    try {
        const decodedToken = request.token ? jwt.verify(request.token, config.SECRET) : null
        if (!decodedToken || !decodedToken.iat) {
            return { isSecured: false, response: response.status(401).json({ error: 'token missing or invalid' }) }
        }
        return { isSecured: true }
    } catch (error) {
        return { isSecured: false, response: response.status(401).json({ error: 'token missing or invalid' }) }
    }
}

module.exports = {
    tokenExtractor,
    verifyToken
}