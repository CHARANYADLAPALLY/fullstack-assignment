import React from "react";

const Filter = ({ search, handleSearch }) => (
  <div>
    find countries: <input value={search} onChange={handleSearch} />
  </div>
);

export default Filter;
