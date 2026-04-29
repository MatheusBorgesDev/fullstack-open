import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

export const getWeatherByCity = (city) =>
  axios
    .get(baseUrl, {
      params: {
        q: city,
        units: 'metric',
        appid: apiKey,
      },
    })
    .then((response) => response.data)
