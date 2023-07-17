import { useState, useEffect } from "react";
import axios from "axios";
import Countries from "./Countries"
import CountryData from "./CountryData"

const App = () => {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);
  const [countriesFiltered, setCountriesFiltered] = useState([]);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
      setCountries(response.data);
    })
  }, [])




  const handleFilterChange = (event) => {
    const filter = event.target.value
    setFilter(filter)
    setCountriesFiltered(countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )
)

  }
  
  return (
    <div>
      Find countries <input value={filter} onChange={handleFilterChange} />
      <br></br>

      <CountryData countriesFiltered={countriesFiltered}/>

      <Countries 
        countriesFiltered={countriesFiltered} 
        setCountriesFiltered={setCountriesFiltered} />
      <br></br>

      <br></br>


    </div>
  )
}

export default App
