require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

if (!url) {
  console.error('MONGODB_URI nao definido no .env')
  process.exit(1)
}

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const run = async () => {
  await mongoose.connect(url)
  console.log('connected')

  const args = process.argv.slice(2)

  if (args.length === 0) {
    const persons = await Person.find({})
    console.log('phonebook:')
    persons.forEach((p) => console.log(`${p.name} ${p.number}`))
  } else if (args.length === 2) {
    const [name, number] = args
    const person = new Person({ name, number })
    await person.save()
    console.log(`added ${name} ${number} to phonebook`)
  } else {
    console.log('uso:')
    console.log('  node mongo.js                        (lista todos)')
    console.log('  node mongo.js "Nome" "Numero"        (adiciona um)')
  }

  await mongoose.connection.close()
}

run().catch((err) => {
  console.error('erro:', err.message)
  process.exit(1)
})
