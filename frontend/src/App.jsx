import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'
import './index.css'

const InputHandler = ({newName, handleNameChange, newNumber, handleNumberChange}) => {
  return(
    <div>
    <div>
          Name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
          Number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    </div>
  )
}

const Persons = ({persons, deleteId}) => {
  return (
    <ul>
        {persons.map(person =>
            <li className='luokka'> {person.name} {person.number}
              <button type="button" onClick={() => deleteId(person.id)}>Delete</button> </li>)}
      </ul>
  )
}

const Buttoner = ({text}) => {
  return (
  <button type="submit">{text}</button>
  )
}

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
        {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const deleteUser = (id) => {
    const user = persons.find(user => user.id === id)
    if (window.confirm(`Delete ${user.name} ?`)) {
      personsService.deleteEntity(id).then(() => {
        setPersons(persons.filter(user => user.id !== id))
      })
      console.log(id)
      console.log('it FINALLY works')
      setErrorMessage(
        `'${user.name}' was deleted from the phonebook` 
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const addName = (event) => {
    event.preventDefault()
    console.log('Toimii', event.target)
    const nameObject ={
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
        alert(`${newName} is already added to phonebook`)
        setNewName('')
        setNewNumber('')
        return
    }
    setErrorMessage(
        `'${newName}' was added to the phonebook` 
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
    personsService
      .create(nameObject)
      .then(initialPersons => {
        setPersons(persons.concat(initialPersons))
        setNewName('')
        setNewNumber('')
      })
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <form onSubmit={addName}>
        <InputHandler newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
        <Buttoner text={'Add'} />
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} deleteId={deleteUser}/>
    </div>
  )

}

export default App