import { useState, useEffect } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { Persons } from './components/Persons'
import { Notification } from './components/Notification'
import * as personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personsService.getAll().then(setPersons)
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 4000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmed = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!confirmed) return

      personsService
        .update(existingPerson.id, { ...existingPerson, number: newNumber })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id === existingPerson.id ? updatedPerson : p))
          )
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${updatedPerson.name}'s number`)
        })
        .catch(() => {
          showNotification(
            `Information of ${existingPerson.name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter((p) => p.id !== existingPerson.id))
        })
      return
    }

    personsService
      .create({ name: newName, number: newNumber })
      .then((createdPerson) => {
        setPersons([...persons, createdPerson])
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${createdPerson.name}`)
      })
      .catch(() => {
        showNotification('Failed to add person', 'error')
      })
  }

  const handleDelete = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return

    personsService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
        showNotification(`Deleted ${person.name}`)
      })
      .catch(() => {
        showNotification(
          `Information of ${person.name} has already been removed from server`,
          'error'
        )
        setPersons(persons.filter((p) => p.id !== person.id))
      })
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />

      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNewNumber(e.target.value)}
        onSubmit={handleSubmit}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onDelete={handleDelete} />
    </div>
  )
}

export default App
