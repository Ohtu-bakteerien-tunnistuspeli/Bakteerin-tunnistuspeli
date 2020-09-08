require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET

module.exports = {
    SECRET,
    PORT
}