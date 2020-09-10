require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET

//for testing when MONGO DB is set up
//if (process.env.NODE_ENV === 'test') {
//    MONGODB_URI = process.env.TEST_MONGODB_URI
//}

module.exports = {
    SECRET,
    PORT
}