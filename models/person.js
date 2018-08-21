const mongoose = require('mongoose')
const fs = require('fs')

const url = `mongodb://${process.env.username}:${process.env.password}@ds225382.mlab.com:25382/fullstack_osa_3`

mongoose.connect(url)

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
