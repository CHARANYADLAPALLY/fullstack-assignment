import React from "react";
import OneCountry from "./OneCountry";

const DisplayCountries = ({ country, search, setSearch }) => {
  if (search) {
    let showCountries = country.filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    );
    if (showCountries.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    } else if (showCountries.length === 1) {
      return <OneCountry showCountries={showCountries} />;
    }

    const handleShow = (event) => {
      setSearch(event.target.attributes.countryname.value);
    };
    return (
      <div>
        {showCountries.map((country) => (
          <div key={country.name}>
            {country.name}
            <button onClick={handleShow} countryname={country.name}>
              show
            </button>
          </div>
        ))}
      </div>
    );
  }
  return (
    <p>start with the search, by typing a couuntry into the search field!</p>
  );
};

export default DisplayCountries;
