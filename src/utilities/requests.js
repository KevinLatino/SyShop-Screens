import axios from 'axios'
import configuration from '../configuration'

export const requestServer = async (endpoint, payload) => {
  const apiUrl = configuration.API_URL
  const url = `${apiUrl}${endpoint}`

  const response = await axios.post(url, payload)

  if (response.status !== 200) {
    throw Error("Response status was not OK")
  }

  return response.data
}
