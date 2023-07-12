import { useEffect } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import axios from 'axios'
import { maybeCompleteAuthSession } from "expo-web-browser"
import configuration from "../configuration"

maybeCompleteAuthSession()

const styles = {
  button: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 3,
    borderWidth: 1,
    boxShadow: "0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)",
    borderColor: "silver",
    color: "#757575",
    backgroundColor: "white",
    width: "fit-content"
  },
  buttonInnerView: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif"
  }
}

const getUserInformation = async (accessToken) => {
  const googleUrl = "https://www.googleapis.com/userinfo/v2/me"
  const { data } = await axios.get(googleUrl, {
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
  const googleLogoUri = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png"

  useEffect(() => {
    if ((response !== null) && (response.type === "success")) {
      const accessToken = response.authentication.accessToken

      getUserInformation(accessToken)
        .then((userInformation) => setUserInformation(userInformation))
    }
  }, [response])

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => promptAsync()}
    >
      <View style={styles.buttonInnerView}>
        <Image source={{uri: googleLogoUri, width: 25, height: 25}} />

        <Text style={styles.buttonText}>
          Sign in with Google
        </Text>
      </View>
    </TouchableOpacity>
  )
}
