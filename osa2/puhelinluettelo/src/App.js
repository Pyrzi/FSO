import { useState, useEffect } from 'react'
import PersonForm from './PersonForm'
import Filter from './Filter'
import PersonsFiltered from './PersonsFiltered'
import PersonService from './PersonService'
import Notification from './Notification'
import axios from 'axios'

const baseUrl = '/api/persons'

axios
.get(baseUrl)
.then(response => {
  const persons = response.data
})

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsFiltered, setFilteredPersons] = useState (persons)
  const [nameFilter, setNameFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [Message, setMessage] = useState(null)
  
  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setPersons(response.data)
        setFilteredPersons(response.data)
      })
  }, [])

  const addName = (event) => {
      event.preventDefault()

      if (!newName || !newNumber) {
        setMessage(`Name or number is missing`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          return
        }

      // If name found
      if (persons.some((person) => person.name === newName)) {
        const existingName = persons.filter(
          (person) => person.name === newName
        )
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const personObject ={
            name: newName,
            number: newNumber,
            id: existingName[0].id
          }
          PersonService
            .update(existingName[0].id, personObject)
            .then((personReturned) => {
              const updatedPersons = persons.map((person) =>
                person.id !== personReturned.id ? person : personReturned
              )
              setPersons(updatedPersons)
              setFilteredPersons(updatedPersons)
              setMessage(`Updated number for ${newName}`)
              setTimeout(() => {
                setMessage(null)
              }, 3000)
            })
            .catch((error) => {
              setMessage(`Information of ${newName} has already been removed from the server`)
              setTimeout(() => {
                setMessage(null)
              }, 3000)
              console.log("erroR")}
              )
        }
        return
      }

      // If name is new
      const personObject ={
        name: newName,
        number: newNumber,
        id: Math.max(...persons.map(person => person.id))+1
      }

      /*const updatedPersons = persons.concat(personObject)
      setPersons(updatedPersons)*/

      PersonService
        .create(personObject)
        .then((personReturned) => {
          setPersons(persons.concat(personReturned))
          if (personReturned.name.includes(nameFilter)) {
          setFilteredPersons(personsFiltered.concat(personReturned)) }
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }

  const deleteName = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      // updating server
      PersonService
      .remove(id)
      .then((response) => {
        const updatedPersons = persons.filter((person) => person.id !== id)
        setPersons(updatedPersons)
        setMessage(`Deleted ${name}`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch((error) => {
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      // updating the list
      const updatedPersons = persons.filter((person) => person.id !== id)
      setPersons(updatedPersons)
      const updatedFilteredPersons = updatedPersons.filter((person) =>
        person.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
      setFilteredPersons(updatedFilteredPersons)
    }
    
    }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
    setFilteredPersons(persons.filter((person) =>
    person.name.toLowerCase().includes(event.target.value.toLowerCase())
  ))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={Message} />
        <Filter 
          nameFilter={nameFilter}
          handleFilterChange={handleFilterChange}
          />
      <h2>add a new</h2>

      <PersonForm 
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>
      <PersonsFiltered
      personsFiltered={personsFiltered}
      deleteName={deleteName} />
    </div>
  )

}

export default App