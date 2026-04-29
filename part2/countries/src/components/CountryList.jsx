export const CountryList = ({ countries, onShow }) => {
  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.common} className="country-row">
          <span>{country.name.common}</span>
          <button onClick={() => onShow(country)}>show</button>
        </div>
      ))}
    </div>
  )
}
