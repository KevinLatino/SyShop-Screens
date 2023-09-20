import axios from 'axios'
import configuration from '../configuration'

export const requestServer = async (endpoint, payload) => {
  const apiUrl = configuration.API_URL
  const url = `${apiUrl}${endpoint}`

  const response = await axios.post(url, payload)

  return response.data
}
