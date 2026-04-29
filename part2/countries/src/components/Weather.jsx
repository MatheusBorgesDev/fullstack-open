import { useState, useEffect } from 'react'
import { getWeatherByCity } from '../services/weather'

export const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!city) return

    setWeather(null)
    setError(null)

    getWeatherByCity(city)
      .then(setWeather)
      .catch(() => setError('Failed to load weather data'))
  }, [city])

  if (error) return <p>{error}</p>
  if (!weather) return <p>Loading weather...</p>

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h3>Weather in {city}</h3>
      <p>Temperature: {weather.main.temp} °C</p>
      <img className="weather-icon" src={iconUrl} alt={weather.weather[0].description} />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  )
}
