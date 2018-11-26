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
    Person
        .find({})
        .then(persons => {
            let personCount = persons.length
            let date = new Date()
            let result = `
            <p>puhelinluettelossa ${personCount} henkilön tiedot<p>
            <p>${date}</p>
            `
            res.send(result)
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(Person.format(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(() => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name) {
        return response.status(400).json({ error: 'name missing' })
    }
    if(!body.number) {
        return response.status(400).json({ error: 'number missing' })
    }

    // Old way of finding duplicate is getting me errors so lets comment it out.

    // if(persons.find(person => person.name === body.name)){
    //     return response.status(400).json({error: 'name must be unique'})
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    Person
        .find({ name: body.name })
        .then(result => {
            if (result.length === 0) {
                person
                    .save()
                    .then(savedPerson => {
                        response.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error)
                    })
            } else {
                response.status(400).json({ error: 'Name already in the database' })
            }
        })
})

// Update name found by id.
app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person
        .findByIdAndUpdate(request.params.id, person, { new: true } )
        .then(updatedPerson => {
            response.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})