const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const caseSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Tapauksen nimen tulee olla vähintään 2 merkkiä pitkä.'],
        maxlength: [100, 'Tapauksen nimen tulee olla enintään 100 merkkiä pitkä.'],
        required: [true, 'Tapauksen nimi on pakollinen.'],
        unique: [true, 'Tapauksen nimen tulee olla uniikki.']
    },
    bacterium: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bacterium'
    },
    anamnesis: {
        type: String
    },
    completionImage: {
        data: {
            type: Buffer
        },
        contentType: {
            type: String
        }
    },
    samples: [
        {
            description: {
                type: String
            },
            rightAnswer: {
                type: Boolean
            }
        }
    ],
    testGroups: [[
        {
            test: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Test'
            },
            isRequired: {
                type: Boolean
            },
            positive: {
                type: Boolean
            },
            alternativeTests: {
                type: Boolean
            }
        }
    ]],
    complete: {
        type: Boolean
    }
})

caseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
caseSchema.plugin(uniqueValidator, { message: 'Tapauksen nimen tulee olla uniikki.' })
const Case = mongoose.model('Case', caseSchema)

module.exports = Case