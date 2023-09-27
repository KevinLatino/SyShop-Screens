import axios from 'axios'
import configuration from '../configuration'
import { showMessage } from '../components/AppSnackBar'

export const requestServer = async (endpoint, payload, errorHandler) => {
  const apiUrl = configuration.API_URL
  const url = `${apiUrl}${endpoint}`

  try {
    const response = await axios.post(url, payload)

    return response.data
  } catch (error) {
    console.log(
      "Axios Error:",
      Object.fromEntries(
        Object.entries(error)
      )
    )

    if (error.response) {
      if (!errorHandler(error.response.data)) {
        if (error.response.status >= 500 && error.response.status < 600) {
          showMessage("Hubo un problema en el servidor, inténtalo más tarde")
        }
      }
    } else {
      showMessage("No se pudo conectar al servidor, révisa tu conexión a Internet")
    }

    throw error
  }
}
