import { useEffect } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import axios from 'axios'
import { maybeCompleteAuthSession } from "expo-web-browser"
import configuration from "../configuration"

maybeCompleteAuthSession()

const styles = {
  button: {
    padding: 30,
    borderRadius: 3,
    boxShadow: "0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)",
    color: "#757575",
    backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)",
    backgroundColor: "white",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "12px 11px"
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
  }
}

const getUserInformation = (accessToken) => {
  const googleUrl = "https://www.googleapis.com/userinfo/v2/me"
  const { data } = axios.get(googleUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return data
}

export default ({ setUserInformation }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: configuration.GOOGLE_WEB_CLIENT_ID,
    androidClientId: configuration.GOOGLE_ANDROID_CLIENT_ID
    // iosClientId: ""
  })

  useEffect(() => {
    if ((response !== null) && (response.type === "success")) {
      const accessToken = response.authentication.accessToken
      const userInformation = getUserInformation(accessToken)

      setUserInformation(userInformation)
    }
  }, [response])

  return (
    <TouchableOpacity
      style={styles.button}
      disabled={request !== null}
      onPress={() => {
        console.log("hollla")
        promptAsync()
      }}
    >
      <Text style={styles.text}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  )
}
