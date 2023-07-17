import { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({country}) => {
    const [weather, setWeather] = useState([]);
    const api_key = process.env.REACT_APP_API_KEY
    // muuttujassa api_key on nyt käynnistyksessä annettu API-avaimen arvo


    useEffect(() => {
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`
          )
          .then((response) => {
            setWeather(response.data)
          })
      }, [])
    console.log(weather)
    
    if (weather != [] && weather != null && weather.length != 0) return (
        <>
        <h2>Weather in {country.capital} </h2>
        <div>Temperature {weather.main.temp} Celsius </div>
        <br/>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
        <br/>
        wind {weather.wind.speed} m/s
        </>
    )
}

export default Weather