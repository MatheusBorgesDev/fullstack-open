import { Weather } from './Weather'

export const CountryDetails = ({ country }) => {
  const languages = country.languages
    ? Object.values(country.languages)
    : []

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital?.[0] ?? 'N/A'}</p>
      <p>Area: {country.area} km²</p>

      <h3>Languages</h3>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        className="flag"
        src={country.flags.png}
        alt={country.flags.alt ?? `Flag of ${country.name.common}`}
      />

      {country.capital?.[0] && <Weather city={country.capital[0]} />}
    </div>
  )
}
