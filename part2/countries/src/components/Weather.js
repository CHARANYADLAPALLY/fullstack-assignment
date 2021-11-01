import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ showCountries }) => {
  const [weather, setWeather] = useState("");
  const api_key = process.env.REACT_APP_API_KEY;
  const capital = showCountries[0].capital;
  const api = `http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`;

  useEffect(() => {
    axios.get(api).then((response) => {
      setWeather(response.data);
    });
  }, [api]);
  return !weather ? (
    <div>searching...</div>
  ) : (
    <div>
      <p>
        <strong>temperature:</strong> {weather.current.temperature} Celsius
        <br />
        <img src={weather.current.weather_icons} alt="current weather" />
      </p>
      <p>
        <strong>wind:</strong> {weather.current.wind_speed} mph, direction{" "}
        {weather.current.wind_dir}{" "}
      </p>
    </div>
  );
};

export default Weather;
