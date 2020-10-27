require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET
const IMAGEURL = process.env.IMAGEURL

let MONGODB_URI
if (process.env.NODE_ENV === 'production') {
    MONGODB_URI = process.env.MONGODB_URI
}

module.exports = {
    SECRET,
    PORT,
    MONGODB_URI,
    IMAGEURL
}
