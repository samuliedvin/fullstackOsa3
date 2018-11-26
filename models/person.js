const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const Schema = mongoose.Schema;
const url = process.env.MONGODB_URI

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

