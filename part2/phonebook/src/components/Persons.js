import React from "react";

const Persons = ({ person, handleDelete }) => {
  return (
    <div>
      <p>
        {person.name} {person.number}
        <button onClick={handleDelete}>delete</button>
      </p>
    </div>
  );
};

export default Persons;
