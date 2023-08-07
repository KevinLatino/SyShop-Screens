import { useState } from 'react'
import { useMutation, requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { showMessage } from '../components/AppSnackBar'
import {
  makeNotEmptyChecker,
  checkEmail,
  checkPhoneNumber
} from '../utilities/validation'
import TextField from '../components/TextField'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { View, StyleSheet } from 'react-native'
import { Button, Text, Divider, ActivityIndicator } from 'react-native-paper'

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
  subtitle: {
    fontSize: 20,
    color: "gray",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
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

const signUpWithPlainAccount = async (userInformation) => {
  const payload = {
    ...userInformation
  }
  const session = await requestServer(
    "/customers_service/sign_up_customer_with_plain_account",
    payload
  )

  return session
}

const signUpWithGoogleAccount = async (userInformation, googleUniqueIdentifier) => {
  delete userInformation["email"]
  delete userInformation["password"]

  const payload = {
    ...userInformation,
    google_unique_identifier: googleUniqueIdentifier
  }
  const session = await requestServer(
    "/customers_service/sign_up_customer_with_google_account",
    payload
  )

  return session
}

export default () => {
  const navigation = useNavigation()
  const [_, setSession] = useAtom(sessionAtom)
  const [signingUpWithPlainAccount, setSigninUpWithPlainAccount] = useState(true)
  const [googleUniqueIdentifier, setGoogleUniqueIdentifier] = useState(null)
  const form = useForm(
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
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )
  const signUpWithPlainAccountMutation = useMutation(
    () => signUpWithPlainAccount(form.fields)
  )
  const signUpWithGoogleAccountMutation = useMutation(
    () => signUpWithGoogleAccount(form.fields, googleUniqueIdentifier)
  )

  const signUpResult = 
    signUpWithPlainAccountMutation.result !== null 
    ? signUpWithPlainAccountMutation.result
    : signUpWithGoogleAccountMutation.result

  if (signUpResult !== null) {
    setSession({
      token: signUpResult.token,
      customerId: signUpResult.user_id
    })

    navigation.navigate("Home")
  }

  const isSignUpLoading = (
    (signUpWithPlainAccountMutation.isLoading) ||
    (signUpWithGoogleAccountMutation.isLoading)
  )

  const handleSignUp = async () => {
    if (form.hasErrors()) {
      showMessage("Por favor provee la información necesaria para registrarte")

      return
    }

    if (signingUpWithPlainAccount) {
      signUpWithPlainAccountMutation.execute()
    } else {
      signUpWithGoogleAccountMutation.execute()
    }
  }

  const fillUpFormWithGoogleData= (userInformation) => {
    const [firstSurname, secondSurname] = userInformation["familyName"].split(" ", 2)

    form.setField("name")(userInformation["name"])
    form.setField("first_surname")(firstSurname)
    form.setField("first_surname")(secondSurname)

    setSigninUpWithPlainAccount(false)
    setGoogleUniqueIdentifier(userInformation["id"])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Registrarse
      </Text>

      <Divider style={{ width: "90%" }} />

      <Text style={styles.subtitle}>
        Ingresa tus datos personales
      </Text>

      <TextField
        value={form.getField("name")}
        onChangeText={form.setField("name")}
        error={form.getError("name")}
        placeholder="Nombre"
      />

      <TextField
        value={form.getField("first_surname")}
        onChangeText={form.setField("first_surname")}
        error={form.getError("first_surname")}
        placeholder="Primer apellido"
      />

      <TextField
        value={form.getField("second_surname")}
        onChangeText={form.setField("second_surname")}
        error={form.getError("second_surname")}
        placeholder="Segundo apellido"
      />

      <TextField
        value={form.getField("phone_number")}
        onChangeText={form.setField("phone_number")}
        error={form.getError("phone_number")}
        placeholder="Número telefónico"
      />

      {
        signingUpWithPlainAccount ??
        (
          <View>
            <TextField
              value={form.getField("email")}
              onChangeText={form.setField("email")}
              error={form.getError("email")}
              placeholder="Correo electrónico"
            />

            <TextField
              value={form.getField("password")}
              onChangeText={form.setField("password")}
              error={form.getError("password")}
              placeholder="Contraseña"
              secureTextEntry
            />
          </View>
        )
      }

      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSignUp}
      >
        {
          isSignUpLoading
          ? <ActivityIndicator animating />
          : "Registrarse"
        }
      </Button>

      <Divider style={{ width: "90%" }} />

      <Text style={styles.thirdText}>
        También puedes registrarte con
      </Text>

      <GoogleSignInButton
        text="Registrate con Google"
        onSignIn={fillUpFormWithGoogleData}
      />
    </View>
  )
}
