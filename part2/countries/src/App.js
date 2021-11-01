import React, { useState, useEffect } from "react";
import axios from "axios";
import DisplayCountries from "./components/DisplayCountries";
import Filter from "./components/Filter";

function App() {
  const [country, setCountry] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountry(response.data);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <Filter search={search} handleSearch={handleSearch} />
      <DisplayCountries
        country={country}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default App;
