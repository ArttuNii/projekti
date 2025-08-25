const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length === 4 || process.argv.length > 5) {
  console.log('Correct format is:')
  console.log('For retrieving database: node mongo.js [password]')
  console.log('For adding a person: node mongo.js [password] [name] [number]')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://arttunii:${password}@projekti.bmwkdem.mongodb.net/persons?retryWrites=true&w=majority&appName=projekti`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personsSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  })

  person.save().then(result => {
  console.log('Person saved!')
  mongoose.connection.close()
  })
}