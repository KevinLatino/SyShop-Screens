import axios from 'axios'

export class RequestError extends Error {
  constructor(message) {
    super(message)

    this.message = message
  }
}

export const requestServer = async (endpoint, payload) => {
  const url = `http://localhost:8000${endpoint}`

  const { data, statusText } = await axios.post(url, payload)

  if (statusText !== "OK") {
    throw RequestError("Response status was not OK")
  }

  return data
}