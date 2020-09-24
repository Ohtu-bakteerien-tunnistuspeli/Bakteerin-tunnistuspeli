const mongoose = require('mongoose')

const skeletonSchema = mongoose.Schema({
    name: {
        type: String,
    }
})

skeletonSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Skeleton = mongoose.model('Skeleton', skeletonSchema)

module.exports = Skeleton