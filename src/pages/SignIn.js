import axios from 'axios'
import { makeNotEmptyChecker, checkEmail } from '../utilities/validation'
import { signOnWithGoogleAccount } from '../utilities/api-calls'
import formatApiUrl from '../utilities/format-api-url'
import { useForm } from '../utilities/forms'
import TextField from '../components/TextField'
import PageTitle from '../components/PageTitle'
import PageSubtitle from './PageSubtitle'
import PageDivider from '../components/PageDivider'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { View, StyleSheet } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: "1.5rem",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: "1rem",
    paddingBottom: "1rem"
  },
})

const signInWithPlainAccount = async (email, password) => {
  const apiUrl = formatApiUrl("/users_service/sign_in_user_with_plain_account")

  const { data, statusText } = await axios.post(apiUrl, { email, password })

  if (statusText !== "OK") {
    throw Error("Could not sign in with a plain account")
  }

  const sessionToken = data.token

  localStorage.setItem("sessionToken", sessionToken)
}

export default () => {
  const {
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

  const handleSignInWithPlainAccount = async (_) => {
    try {
      await signInWithPlainAccount(
        getField("email"),
        getField("password")
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignInWithGoogleAccount = async (userInformation) => {
    try {
      await signOnWithGoogleAccount(userInformation)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <PageTitle text="Inicia sesión" />

      <PageDivider />

      <PageSubtitle text="Ingresa tu correo electrónico y contraseña" />

      <TextField
        text={getField("email")}
        onChangeText={setField("email")}
        error={getError("email")}
        label="Correo electrónico"
      />

      <TextField
        text={getField("password")}
        onChangeText={setField("password")}
        error={getError("password")}
        label="Contraseña"
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleSignInWithPlainAccount}
        disabled={hasErrors()}
      >
        Iniciar sesión
      </Button>

      <PageDivider />

      <PageSubtitle text="Inicia sesión con tu cuenta de Google" />

      <GoogleSignInButton
        text="Iniciar sesión"
        onSignIn={handleSignInWithGoogleAccount}
      />

      <StatusBar style="auto" />
    </View>
  )
}
