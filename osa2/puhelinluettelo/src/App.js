import { useState } from 'react'
import PersonForm from './PersonForm'
import Filter from './Filter'
import PersonsFiltered from './PersonsFiltered'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [personsFiltered, setFilteredPersons] = useState (persons)
  const [nameFilter, setNameFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  
  const addName = (event) => {
      event.preventDefault()
      if (persons.some((person) => person.name === newName)) {
        alert(`${newName} is already added to phonebook`)
        return;
      }
    
      const personObject ={
        name: newName,
        number: newNumber
      }

      const updatedPersons = persons.concat(personObject);
      setPersons(updatedPersons);

      const updatedFilteredPersons = updatedPersons.filter((person) =>
        person.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
      setFilteredPersons(updatedFilteredPersons)

      setNewName('')
      setNewNumber('')
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
      personsFiltered={personsFiltered} />
    </div>
  )

}

export default App