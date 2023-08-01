// import axios from 'axios'
import { makeNotEmptyChecker, checkEmail } from '../utilities/validation'
import { signOnWithGoogleAccount } from '../utilities/api-calls'
// import formatApiUrl from '../utilities/format-api-url'
import useForm from '../hooks/useForm'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import TextField from '../components/TextField'
import PageTitle from '../components/PageTitle'
import PageSubtitle from './PageSubtitle'
import PageDivider from '../components/PageDivider'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native-paper'
// import NetworkError from '../utilities/NetworkError'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: "1.5rem",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: "1rem",
    paddingBottom: "1rem"
  },
  title: {
    fontSize: 50,
    color: "#344340",
    fontWeight: "bold",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1rem",
  },
  subtitle: {
    fontSize: 20,
    color: "gray",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  Button: {
    display: "flex",
    width: 225,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c20000"
  },
  thirdText: {
    fontSize: 18,
    color: "#344340",
    fontWeight: "bold",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
})

const signInWithPlainAccount = async (credentials, setSession) => {
  // const apiUrl = formatApiUrl("/users_service/sign_in_user_with_plain_account")

  // const { data, statusText } = await axios.post(apiUrl, credentials)

  // if (statusText !== "OK") {
  //   throw NetworkError("Could not sign in with a plain account")
  // }

  // const session = {
  //   token: data.token,
  //   customerId: data.user_id
  // }

  // setSession(session)
  console.log("Siuuu")
}

export default () => {
  const {
    fields,
    setField,
    getField,
    getError,
    hasErrors
  } = useForm(
    {
      email: "",
      password: ""
    },
    {
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )
  const [_, setSession] = useAtom(sessionAtom)

  const handleSignInWithPlainAccount = async (_) => {
    try {
      await signInWithPlainAccount(fields, setSession)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignInWithGoogleAccount = async (userInformation) => {
    try {
      await signOnWithGoogleAccount(userInformation, setSession)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Bienvenido </Text>
      <Text style={styles.subtitle}>¡Inicia sesión para comenzar!</Text>

      <TextField
        value={getField("email")}
        onChangeText={setField("email")}
        error={getError("email")}
        placeholder="Correo electrónico"
      />

      <TextField
        value={getField("password")}
        onChangeText={setField("password")}
        error={getError("password")}
        placeholder="Contraseña"
        secureTextEntry
      />

      <Button
        style={styles.Button}
        mode="contained"
        onPress={handleSignInWithPlainAccount}
        disabled={hasErrors()}
      >
        Iniciar sesión
      </Button>

      <PageDivider />

      <Text style={styles.thirdText}>O también</Text>

      <GoogleSignInButton
        text="Iniciar sesión con google"
        onSignIn={handleSignInWithGoogleAccount}
      />

      <StatusBar style="auto" />
    </View>
  )
}
