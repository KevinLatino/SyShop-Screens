import axios from 'axios'
import configuration from '../configuration'

export const requestServer = async (endpoint, payload) => {
  const apiUrl = configuration.API_URL
  const url = `${apiUrl}${endpoint}`

  const { data, statusText } = await axios.post(url, payload)

  if (statusText !== "OK") {
    throw Error("Response status was not OK")
  }

  return data
}
