import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import { useEffect } from 'react';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const person = persons.find((person) => person.name === newName);

    if (person) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with the new one?`
        )
      ) {
        const updatedPerson = { ...person, number: newNumber };
        personService
          .update(person.id, updatedPerson)
          .then((updatedContect) => {
            setPersons((persons) =>
              persons.map((person) =>
                person.name === updatedContect.name ? updatedContect : person
              )
            );
            setNewName('');
            setNewNumber('');
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(personObject).then((newPerson) => {
      setPersons(persons.concat(newPerson));
      setNewName('');
      setNewNumber('');
    });
  };

  const handleDelete = (person) => {
    if (confirm(`Delete ${person.name}`)) {
      personService.remove(person.id).then(() => {
        personService.getAll().then((persons) => setPersons(persons));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <h3>add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        name={newName}
        onNameChange={(e) => setNewName(e.target.value)}
        number={newNumber}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
