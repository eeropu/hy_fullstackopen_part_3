require('dotenv').load()
const express = require('express')
const app = express()

//Use build folder for frontend
app.use(express.static('build'))

//Use body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())

//Logging
const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

//Enable CORS
const cors = require('cors')
app.use(cors())

//Enable mongoose model
const Person = require('./models/person')

//Helper functions
const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Matti Tienari',
        number: '040-123456'
    },
    {
        id: 3,
        name: 'Arto Järvinen',
        number: '040-123456'
    },
    {
        id: 4,
        name: 'Lea Kutvonen',
        number: '040-123456'
    }
]

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(result => {
      res.json(result.map(Person.formatPerson))
    })
})
app.post('/api/persons', (req, res) => {
    const body = req.body

    if(body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'content missing'})
    } else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
      .save()
      .then(newPerson => {
        res.json(Person.formatPerson(newPerson))
      })
})

app.get('/api/persons/:id', (req, res) => {
    Person
      .findById(req.params.id)
      .then(person => {
        if (person) {
          res.json(Person.formatPerson(person))
        } else {
          res.status(404).end()
        }
      })
      .catch(error => {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
      })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findOneAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(Person.formatPerson(person))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
      .findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
      })

})

app.get('/api/info', (req, res) => {
    let date = new Date()
    res.status(200).send(`Puhelinluettelossa on ${persons.length} henkilön tiedot <br><br>` + date)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
