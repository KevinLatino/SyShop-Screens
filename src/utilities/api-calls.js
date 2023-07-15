import axios from 'axios'
import formatApiUrl from './format-api-url'

export const signOnWithGoogleAccount = async (userInformation) => {
  const apiUrl = formatApiUrl("/users_service/sign_on_user_with_google_account")

  const { data, statusText } = await axios.post(apiUrl, userInformation)

  if (statusText !== "OK") {
    throw Error("Could not sign in with a Google account")
  }

  const sessionToken = data.token

  localStorage.setItem("sessionToken", sessionToken)
}
