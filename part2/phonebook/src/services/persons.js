import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

export const getAll = () => axios.get(baseUrl).then((response) => response.data)

export const create = (newPerson) =>
  axios.post(baseUrl, newPerson).then((response) => response.data)

export const update = (id, updatedPerson) =>
  axios
    .put(`${baseUrl}/${id}`, updatedPerson)
    .then((response) => response.data)

export const remove = (id) => axios.delete(`${baseUrl}/${id}`)
