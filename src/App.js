import { CircularProgress } from "@material-ui/core";
import React, { useState, useEffect, useCallback } from "react";
import Weather from "./component/Weather";
const API_KEY = "8edbea35d31771f02cd61bce4d769a51";
const UNITS = "Metric";
const LANG = "en";
const App = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [city, setCity] = useState("london");
  const [error, setError] = useState(null);

  function handleResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error: location" + response.statusText.toLowerCase());
    }
  }

  const getWeather = useCallback((city) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${LANG}&appid=${API_KEY}&units=${UNITS}`;
    return fetch(URL)
      .then((res) => handleResponse(res))
      .then((weather) => {
        console.log(weather);
        if (Object.entries(weather).length) {
          const mappedData = mapDataToWeatherInterface(weather);
          return mappedData;
        }
      });
  }, []);

  useEffect(() => {
    getWeather(city)
      .then((data) => {
        setCurrentWeather(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [city, getWeather]);

  function mapDataToWeatherInterface(data) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ];
    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    const sunrise = new Date(data.sys.sunrise * 1000)
      .toLocaleTimeString()
      .slice(0, 5);
    const sunset = new Date(data.sys.sunset * 1000)
      .toLocaleTimeString()
      .slice(0, 5);
    const mapped = {
      city: data.name,
      country: data.sys.country,
      countryCode: data.cod,
      date,
      temperature: data.main.temp,
      sunrise,
      sunset,
      humidity: data.main.humidity,
      icon: data.weather[0].icon
    };
    return mapped;
  }

  const handleCityChange = (city) => setCity(city);

  if (currentWeather && Object.keys(currentWeather).length) {
    return (
      <div>
        <Weather
          currentWeather={currentWeather}
          onCityChange={handleCityChange}
        />
      </div>
    );
  } else {
    return (
      <div>
        <CircularProgress color={error ? "primary" : "secondary"} />
        {error ? <p>{error}</p> : ""}
      </div>
    );
  }
};

export default App;
