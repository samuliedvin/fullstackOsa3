const mongoose = require('mongoose')

const USER = 'xxx'
const PASS = 'xxx'

const url = `mongodb://${USER}:${PASS}@ds115434.mlab.com:15434/fullstack2018`

mongoose.connect(url, {
    useNewUrlParser: true
})

const Person = mongoose.model('Number', {
    name: String,
    number: String
})

module.exports = Person

