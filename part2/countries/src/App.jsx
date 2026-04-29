import { useState, useEffect } from 'react'
import { getAll } from './services/countries'
import { CountryList } from './components/CountryList'
import { CountryDetails } from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAll().then(setCountries)
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelected(null)
  }

  const filtered = filter
    ? countries.filter((c) =>
        c.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    : []

  const renderResult = () => {
    if (selected) return <CountryDetails country={selected} />
    if (!filter) return null
    if (filtered.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }
    if (filtered.length === 0) {
      return <p>No matches found</p>
    }
    if (filtered.length === 1) {
      return <CountryDetails country={filtered[0]} />
    }
    return <CountryList countries={filtered} onShow={setSelected} />
  }

  return (
    <div>
      <h1>Country finder</h1>
      <div>
        find countries:{' '}
        <input value={filter} onChange={handleFilterChange} />
      </div>
      {renderResult()}
    </div>
  )
}

export default App
