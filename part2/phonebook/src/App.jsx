import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import { useEffect } from 'react';
import personService from './services/persons';
import Notification from './components/Notification';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationConfig, setNotificationConfig] = useState({
    message: null,
    severity: 'error',
  });

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
            setNotificationConfig({
              message: `Updated ${updatedContect.name}`,
              severity: 'success',
            });
            setTimeout(() => {
              setNotificationConfig({ message: null });
            }, 3000);
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

      setNotificationConfig({
        message: `Added ${newPerson.name}`,
        severity: 'success',
      });
      setTimeout(() => {
        setNotificationConfig({ message: null });
      }, 3000);
    });
  };

  const handleDelete = (person) => {
    if (confirm(`Delete ${person.name}`)) {
      personService
        .remove(person.id)
        .then(() => {
          personService.getAll().then((persons) => setPersons(persons));
          setNotificationConfig({
            message: `Deleted ${person.name}`,
            severity: 'success',
          });
          setTimeout(() => {
            setNotificationConfig({ message: null });
          }, 3000);
        })
        .catch(() => {
          setNotificationConfig({
            message: `Information of ${person.name} has already been removed from server!`,
            severity: 'error',
          });
          setTimeout(() => {
            setNotificationConfig({ message: null });
          }, 3000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {notificationConfig.message && <Notification {...notificationConfig} />}
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
