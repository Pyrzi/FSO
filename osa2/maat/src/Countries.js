const Countries = ({countriesFiltered, setCountriesFiltered}) => {
    if (countriesFiltered.length === 1) return null

    if (countriesFiltered.length > 10) return (
        <div>
        Too many matches, specify another filter
        </div>
    )

    return countriesFiltered.map((country) => (
        <div key={country.name.common}>
        {country.name.common}{" "}
        <button onClick={() => setCountriesFiltered([country])}>show</button>
        </div>
    ))
}


export default Countries