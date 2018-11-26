const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :body :res[content-length] - :response-time ms'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    let personCount = persons.length  
    let date = new Date()
    let result = `
    <p>puhelinluettelossa ${personCount} henkilön tiedot<p>
    <p>${date}</p>
    `
    res.send(result)
})

app.get('/api/persons', (req, res) => {
    Person
    .find({})
    .then(persons => {
        res.json(persons.map(Person.format))
    })    
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if ( person ) {
    response.json(person)
    } else {
    response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name) {
        return response.status(400).json({error: 'name missing'})
    }
    if(!body.number) {
        return response.status(400).json({error: 'number missing'})
    }

    // Old way of finding duplicate is getting me errors so lets comment it out.

    // if(persons.find(person => person.name === body.name)) {
    //     return response.status(400).json({error: 'name must be unique'})
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedPerson => {
            response.json(Person.format(savedPerson))
        })
        .catch(error => {
            console.log(error)
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})