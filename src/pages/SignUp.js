import axios from 'axios'
import validator from 'validator'
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
    gap: "1rem",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: "1rem",
    paddingBottom: "1rem"
  }
})

const signUpWithPlainAccount = async (userInformation) => {
  const apiUrl = formatApiUrl("/users_service/sign_up_customer_with_plain_account")

  const { data, statusText } = await axios.post(apiUrl, userInformation)

  if (statusText !== "OK") {
    throw Error("Could not sign up the customer with a plain account")
  }

  const sessionToken = data.token

  localStorage.setItem("sessionToken", sessionToken)
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
    getError
  } = useForm(
    {
      name: "",
      first_surname: "",
      second_surname: "",
      phone_number: "",
      picture: null,
      email: "",
      password: ""
    },
    {
      name: makeNotEmptyChecker("Nombre vacío"),
      first_surname: makeNotEmptyChecker("Primer apellido vacío"),
      second_surname: makeNotEmptyChecker("Segundo apellido vació"),
      phone_number: checkPhoneNumber,
      picture: null,
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )

  const handleSignUpWithPlainAccount = async (_) => {
    try {
      await signUpWithPlainAccount(userInformation)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignUpWithGoogleAccount = async (userInformation) => {
    try {
      await signOnWithGoogleAccount(userInformation)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <PageTitle text="Registrate" />

      <PageDivider />

      <PageSubtitle text="Ingresa tus datos personales" />

      <TextField
        text={getField("name")}
        onChangeText={setField("name")}
        error={getError("name")}
        label="Nombre"
      />

      <TextField
        text={getField("first_surname")}
        onChangeText={setField("first_surname")}
        error={getError("first_surname")}
        label="Primer apellido"
      />

      <TextField
        text={getField("second_surname")}
        onChangeText={setField("second_surname")}
        error={getError("second_surname")}
        label="Segundo apellido"
      />

      <TextField
        text={getField("phone_number")}
        onChangeText={setField("phone_number")}
        error={getError("phone_number")}
        label="Número telefónico"
      />

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
