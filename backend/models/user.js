const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
    username: {
        type: String,
        minlength: [2, 'Käyttäjänimen tulee olla vähintään 2 merkkiä pitkä.'],
        maxlength: [100, 'Käyttäjänimen tulee olla enintään 100 merkkiä pitkä.'],
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})
userSchema.plugin(uniqueValidator, { message: 'Käyttäjänimen tulee olla uniikki.' })
const User = mongoose.model('User', userSchema)

module.exports = User