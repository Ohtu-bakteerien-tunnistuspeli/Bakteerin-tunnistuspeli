const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const testSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Testin nimen tulee olla vähintään 2 merkkiä pitkä.'],
        maxlength: [100, 'Testin nimen tulee olla enintään 100 merkkiä pitkä.'],
        required: true,
        unique: [true, 'Testin nimen tulee olla uniikki.']
    }
})

testSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

testSchema.plugin(uniqueValidator, { message: 'Testin nimen tulee olla uniikki.' })
const Test = mongoose.model('Test', testSchema)

module.exports = Test