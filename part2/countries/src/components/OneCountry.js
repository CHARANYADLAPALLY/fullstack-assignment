import React from "react";
import Weather from "./Weather";

const OneCountry = ({ showCountries }) => {
  return (
    <div>
      <h1>{showCountries[0].name}</h1>
      <div>
        <p>capital {showCountries[0].capital}</p>
        <p>population {showCountries[0].population}</p>
      </div>
      <h2>Spoken languages</h2>
      <div>
        <ul>
          {showCountries[0].languages.map((country) => (
            <li key={country.name}>{country.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <img
          src={showCountries[0].flag}
          alt="country flag"
          width="150"
          height="100"
        />
      </div>
      <div>
        <h2>Weather in {showCountries[0].capital}</h2>
        <Weather showCountries={showCountries} />
      </div>
    </div>
  );
};

export default OneCountry;
