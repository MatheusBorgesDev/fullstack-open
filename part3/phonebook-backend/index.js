require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
if (!url) {
  console.error('MONGODB_URI is not defined')
  process.exit(1)
}

mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => {
    console.error('error connecting to MongoDB:', err.message)
    process.exit(1)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (request) => {
  if (request.method !== 'POST') return ''
  return JSON.stringify(request.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

app.get('/info', async (request, response) => {
  const count = await Person.countDocuments({})
  const now = new Date()
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${now}</p>
  `)
})

app.get('/api/persons/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)
  if (!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

app.post('/api/persons', async (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const nameExists = await Person.findOne({ name: body.name })
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  const savedPerson = await person.save()
  response.status(201).json(savedPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
