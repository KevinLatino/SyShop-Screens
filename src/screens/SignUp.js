import axios from 'axios'
import validator from 'validator'
import { makeNotEmptyChecker, checkEmail } from '../utilities/validation'
import { signOnWithGoogleAccount } from '../utilities/api-calls'
import formatApiUrl from '../utilities/format-api-url'
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
import NetworkError from '../utilities/NetworkError'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: "1rem",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: "1rem",
    paddingBottom: "1rem"
  }
})

const signUpWithPlainAccount = async (userInformation, setSession) => {
  const apiUrl = formatApiUrl(
    "/customers_service/sign_up_customer_with_plain_account"
  )

  const { data, statusText } = await axios.post(apiUrl, userInformation)

  if (statusText !== "OK") {
    throw NetworkError("Could not sign up the customer with a plain account")
  }

  const session = {
    token: data.token,
    customerId: data.user_id
  }

  setSession(session)
}

const checkPhoneNumber = (phoneNumber) => {
  if (!validator.isMobilePhone(phoneNumber, "es-CR")) {
    return "Número telefónico inválido"
  }

  return null
}

export default () => {
  const {
    getField,
    setField,
    getError,
    fields
  } = useForm(
    {
      name: "",
      first_surname: "",
      second_surname: "",
      phone_number: "",
      picture: "",
      email: "",
      password: ""
    },
    {
      name: makeNotEmptyChecker("Nombre vacío"),
      first_surname: makeNotEmptyChecker("Primer apellido vacío"),
      second_surname: makeNotEmptyChecker("Segundo apellido vació"),
      phone_number: checkPhoneNumber,
      picture: "",
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )
  const [_, setSession] = useAtom(sessionAtom)

  const handleSignUpWithPlainAccount = async (_) => {
    try {
      await signUpWithPlainAccount(fields, setSession)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignUpWithGoogleAccount = async (userInformation) => {
    try {
      await signOnWithGoogleAccount(userInformation, setSession)
    } catch (error) {
      console.log(error)
    }
  }

  console.log(fields)

  return (
    <View style={styles.container}>
      <PageTitle text="Registrate" />

      <PageDivider />

      <PageSubtitle text="Ingresa tus datos personales" />

      <TextField
        value={getField("name")}
        onChangeText={setField("name")}
        error={getError("name")}
        label="Nombre"
      />

      <TextField
        value={getField("first_surname")}
        onChangeText={setField("first_surname")}
        error={getError("first_surname")}
        label="Primer apellido"
      />

      <TextField
        value={getField("second_surname")}
        onChangeText={setField("second_surname")}
        error={getError("second_surname")}
        label="Segundo apellido"
      />

      <TextField
        value={getField("phone_number")}
        onChangeText={setField("phone_number")}
        error={getError("phone_number")}
        label="Número telefónico"
      />

      <TextField
        value={getField("email")}
        onChangeText={setField("email")}
        error={getError("email")}
        label="Correo electrónico"
      />

      <TextField
        value={getField("password")}
        onChangeText={setField("password")}
        error={getError("password")}
        label="Contraseña"
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleSignUpWithPlainAccount}
      >
        Registrarse
      </Button>

      <PageDivider />

      <PageSubtitle text="Registrate con tu cuenta de Google" />

      <GoogleSignInButton
        text="Registrarse"
        onSignIn={handleSignUpWithGoogleAccount}
      />

      <StatusBar style="auto" />
    </View>
  )
}
