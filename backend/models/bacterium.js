const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bacteriumSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Bakteerin nimen tulee olla vähintään 2 merkkiä pitkä.'],
        maxlength: [100, 'Bakteerin nimen tulee olla enintään 100 merkkiä pitkä.'],
        required: true,
        unique: [true, 'Bakteerin nimen tulee olla uniikki.']
    }
})

bacteriumSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
bacteriumSchema.plugin(uniqueValidator, { message: 'Bakteerin nimen tulee olla uniikki.' })
const Bacterium = mongoose.model('Bacterium', bacteriumSchema)

module.exports = Bacterium