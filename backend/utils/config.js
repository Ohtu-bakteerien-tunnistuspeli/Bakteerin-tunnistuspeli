require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET
console.log('totally not okay to print this stuff' + SECRET)

let MONGODB_URI
if (process.env.NODE_ENV === 'production') {
    MONGODB_URI = process.env.MONGODB_URI
}

module.exports = {
    SECRET,
    PORT,
    MONGODB_URI
}