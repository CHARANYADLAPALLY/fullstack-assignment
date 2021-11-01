import React, { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import personServices from "./services/personServices";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [showAll] = useState(true);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personServices.getAll().then((intialNumbers) => {
      setPersons(intialNumbers);
    });
  }, []);

  const notificationMessage = (text, type) => {
    setNotification(`${text}`);
    setErrorMessage(type);
    setTimeout(() => setNotification(null), 3000);
    setNewName("");
    setNewNumber("");
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (personObject.name === "" || personObject.number === "")
      return window.alert("Please provide a name and a number!");
    if (persons.map((person) => person.name).includes(newName)) {
      if (
        window.confirm(
          `${newName} is already in the phonebook. Do you want to update the number?`
        )
      ) {
        const id = persons.find((p) => p.name === newName).id;

        personServices
          .update(id, personObject)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === id ? updatedPerson : person
              )
            );
            notificationMessage(`${newName} has been updated!`, "update");
          })
          .catch((error) => {
            if (error.message === "Request failed with status code 404") {
              notificationMessage(
                `${newName} has been already removed from the phonebook!`,
                "error"
              );
            }
          });
      }
    } else {
      personServices.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        notificationMessage(`${newName} added to the phonebook!`, "ok");
      });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      personServices
        .deleteEntry(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          notificationMessage(`${name} has been deleted!`, "ok");
        })
        .catch(() => {
          notificationMessage(
            `${name} has been already removed from the server.`,
            "error"
          );
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const personsToShow = showAll
    ? persons.filter((persons) =>
        persons.name.toLowerCase().includes(search.toLowerCase())
      )
    : persons;

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={errorMessage} />
      <Filter search={search} handleSearch={handleSearch} />
      <h3>Add a new person</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      {personsToShow.map((person) => (
        <Persons
          key={person.name}
          person={person}
          handleDelete={() => handleDelete(person.id, person.name)}
        />
      ))}
    </div>
  );
};

export default App;
