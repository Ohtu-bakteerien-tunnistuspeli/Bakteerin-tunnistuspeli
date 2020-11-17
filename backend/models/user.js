const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
    username: {
        type: String,
        minlength: [2, 'Käyttäjänimen tulee olla vähintään 2 merkkiä pitkä.'],
        maxlength: [100, 'Käyttäjänimen tulee olla enintään 100 merkkiä pitkä.'],
        required: [true, 'Käyttäjänimi on pakollinen.'],
        unique: [true, 'Käyttäjänimen tulee olla uniikki.']
    },
    passwordHash: {
        type: String,
        required: true
    },
    singleUsePassword: {
        passwordHash: {
            type: String
        },
        generationTime: {
            type: Date
        }
    },
    admin: {
        type: Boolean,
        required: true
    },
    classGroup: {
        type: String,
        validate: {
            validator: (group) => {
                if (group) {
                    return /C-+\d+/.test(group)
                }
                return true
            },
            message: 'Vuosikurssin tule alkaa merkeillä \'C-\' ja loppua lukuun.'
        },
        maxlength: [10, 'Vuosikurssin tulee olla enintään C-99999999.']
    },
    email: {
        type: String,
        validate: {
            validator: (mailAddress) => {
                return /\S+@\S+/.test(mailAddress)
            },
            message: 'Sähköpostiosoite on virheellinen.'
        },
        required: [true, 'Sähköpostiosoite on pakollinen.'],
        maxlength: [100, 'Sähköpostin tulee olla enintään 100 merkkiä pitkä.'],
        unique: [true, 'Sähköpostin tulee olla uniikki.']
    },
    studentNumber: {
        type: String,
        validate: {
            validator: (number) => {
                if (number) {
                    return /^[0-9]+/.test(number)
                }
                return true
            },
            message: 'Opiskelijanumeron tulee  olla luku.'
        },
        maxlength: [100, 'Opiskelijanumeron tulee olla enintään 100 merkkiä pitkä.'],
    },
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
        delete returnedObject.singleUsePassword
    }
})
userSchema.plugin(uniqueValidator, { message: 'Käyttäjänimen tulee olla uniikki.' })
const User = mongoose.model('User', userSchema)

module.exports = User