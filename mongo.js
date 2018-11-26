const mongoose = require('mongoose')

const USER = process.env.USER
const PASS = process.env.PASS

const name = process.argv[2]
const number = process.argv[3]

const url = `mongodb://${USER}:${PASS}@ds115434.mlab.com:15434/fullstack2018`

mongoose.connect(url, {
    useNewUrlParser: true
})

const Number = mongoose.model('Number', {
    name: String,
    number: String
})

if(process.argv.length === 2) {
    Number
    .find({})
        .then(result => {
            console.log('puhelinluettelo:')
            result.forEach(number => {
            console.log(number.name, number.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 4) {
    const newNumber = new Number ({
        name: name,
        number: number
    })
    newNumber
        .save()
        .then(result => {
        console.log('Tietokantaan tallennettu numero ', name, number)
        mongoose.connection.close()
        })
}

