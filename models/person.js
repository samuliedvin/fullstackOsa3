const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const USER = 'xx'
const PASS = 'xx'
const url = `mongodb://${USER}:${PASS}@ds115434.mlab.com:15434/fullstack2018`

const numberSchema = new Schema({
    name: String,
    number: String
})

numberSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

mongoose.connect(url, {
    useNewUrlParser: true
})

const Person = mongoose.model('Number', numberSchema)



module.exports = Person

