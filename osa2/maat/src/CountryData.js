import Weather from './Weather'

const CountryData = ({countriesFiltered}) => {
    if (countriesFiltered.length != 1) return null

    else {
        const country = countriesFiltered[0]
        return (
            <div>
                <h1>{country.name.common}</h1>
                capital {country.capital}
                <br/>
                area {country.area}
                <h3>languages:</h3>
                <ul>
                    {Object.entries(country.languages).map(([key, value]) => (
                    <li key={key}>{value}</li>
                    ))}
                </ul>
                <img src={country.flags.png}/>
                <Weather country={country}/>
                
            </div>
        )
    }
}




export default CountryData