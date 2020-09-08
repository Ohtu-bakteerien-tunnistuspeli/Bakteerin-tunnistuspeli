const mongoose = require('mongoose')

const bacteriumSchema = mongoose.Schema({
  name: String
})

bacteriumSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Bacterium = mongoose.model('Bacterium', bacteriumSchema)

module.exports = Bacterium