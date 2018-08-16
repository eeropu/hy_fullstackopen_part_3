const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

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
    res.json(persons)
})
app.post('/api/persons', (req, res) => {
    const body = req.body

    console.log(body)

    if(body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'content missing'})
    } else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.get('/api/info', (req, res) => {
    let date = new Date()
    res.status(200).send(`Puhelinluettelossa on ${persons.length} henkilön tiedot <br><br>` + date)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
