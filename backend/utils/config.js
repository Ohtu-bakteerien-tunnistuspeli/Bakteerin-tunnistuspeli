require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET
const IMAGEURL = process.env.IMAGEURL
const EMAILHOST = process.env.EMAILHOST
const EMAILUSER = process.env.EMAILUSER
const EMAILPASSWORD = process.env.EMAILPASSWORD

let MONGODB_URI
if (process.env.NODE_ENV === 'production') {
    MONGODB_URI = process.env.MONGODB_URI
}

module.exports = {
    SECRET,
    PORT,
    MONGODB_URI,
    IMAGEURL,
    EMAILHOST,
    EMAILUSER,
    EMAILPASSWORD
}
