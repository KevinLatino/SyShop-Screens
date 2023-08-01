import axios from 'axios'
import validator from 'validator'
import { makeNotEmptyChecker, checkEmail } from '../utilities/validation'
import { signOnWithGoogleAccount } from '../utilities/api-calls'
import useForm from '../hooks/useForm'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import TextField from '../components/TextField'
import PageTitle from '../components/PageTitle'
import PageSubtitle from './PageSubtitle'
import PageDivider from '../components/PageDivider'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { View, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: "1rem",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: "1rem",
    paddingBottom: "1rem"
  },
  title: {
    fontSize: 35,
    color: "#344340",
    fontWeight: "bold",
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
  Subtitle: {
    fontSize: 20,
    color: "gray",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
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

const signUpWithPlainAccount = async (userInformation, setSession) => {
  // const apiUrl = formatApiUrl(
  //   "/customers_service/sign_up_customer_with_plain_account"
  // )

  // const { data, statusText } = await axios.post(apiUrl, userInformation)

  // if (statusText !== "OK") {
  //   throw NetworkError("Could not sign up the customer with a plain account")
  // }

  // const session = {
  //   token: data.token,
  //   customerId: data.user_id
  // }

  // setSession(session)
  console.log("pene")
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
      second_surname: makeNotEmptyChecker("Segundo apellido vacío"),
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
      <Text style={styles.title}>Registrarse</Text>

      <PageDivider />

      <Text style={styles.Subtitle}>Ingresa tus datos personales</Text>

      <TextField
        value={getField("name")}
        onChangeText={setField("name")}
        error={getError("name")}
        placeholder="Nombre"
      />

      <TextField
        value={getField("first_surname")}
        onChangeText={setField("first_surname")}
        error={getError("first_surname")}
        placeholder="Primer apellido"
      />

      <TextField
        value={getField("second_surname")}
        onChangeText={setField("second_surname")}
        error={getError("second_surname")}
        placeholder="Segundo apellido"
      />

      <TextField
        value={getField("phone_number")}
        onChangeText={setField("phone_number")}
        error={getError("phone_number")}
        placeholder="Número telefónico"
      />

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
        onPress={handleSignUpWithPlainAccount}
      >
        Registrarse
      </Button>

      <PageDivider />

      <Text style={styles.thirdText}>También puedes registrarte con:</Text>

      <GoogleSignInButton
        text="Registrate con Google"
        onSignIn={handleSignUpWithGoogleAccount}
      />

      <StatusBar style="auto" />
    </View>
  )
}
