const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

mongoose.connect(process.env.MongoDB_URI)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.formatPerson = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', personSchema)



module.exports = Person
