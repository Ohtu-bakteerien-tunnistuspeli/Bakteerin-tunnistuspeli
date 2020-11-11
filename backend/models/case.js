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
        type: String,
        maxlength: [10000, 'Tapauksen anamneesin tulee olla enintään 10000 merkkiä pitkä.']
    },
    completionText: {
        type: String,
        maxlength: [10000, 'Tapauksen lopputekstin tulee olla enintään 10000 merkkiä pitkä.']
    },
    completionImage: {
        url: {
            type: String
        },
        contentType: {
            type: String
        }
    },
    samples: [
        {
            description: {
                type: String,
                maxlength: [1000, 'Näytteen kuvauksen tulee olla enintään 1000 merkkiä pitkä.']
            },
            rightAnswer: {
                type: Boolean
            }
        }
    ],
    testGroups: [[
        {
            tests: [{
                test: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Test'
                },
                positive: {
                    type: Boolean
                }
            }],
            isRequired: {
                type: Boolean
            }
        }
    ]],
    hints: [{
        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test'
        },
        hint: {
            type: String,
            maxlength: [1000, 'Vinkin tulee olla enintään 1000 merkkiä pitkä.']
        }
    }],
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