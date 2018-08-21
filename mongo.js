const mongoose = require('mongoose')
const fs = require('fs')

const credentials = fs.readFileSync('./credentials.txt', 'utf8').split('\n')
const url = `mongodb://${credentials[0]}:${credentials[1]}@ds225382.mlab.com:25382/fullstack_osa_3`

mongoose.connect(url)
const Person = mongoose.model('Person', {
  name: String,
  number: String
})



if(process.argv[2] === undefined){
  Person
    .find({})
    .then(result => {
      console.log('Puhelinluettelo:')
      result.forEach(person => {
        console.log(person.name + " " + person.number)
      })
      mongoose.connection.close()
    })
} else if (process.argv[3] === undefined){
  console.log('Insufficient arguments!')
} else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person
    .save()
    .then(response => {
      console.log(`Lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)
      mongoose.connection.close()
    })
}
