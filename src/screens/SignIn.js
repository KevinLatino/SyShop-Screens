import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { makeNotEmptyChecker, checkEmail } from '../utilities/validators'
import { showMessage } from '../components/AppSnackBar'
import TextField from '../components/TextField'
import GoogleSignInButton from '../components/GoogleSignInButton'
import LoadingSpinner from '../components/LoadingSpinner'
import Screen from '../components/Screen'
import { StyleSheet } from 'react-native'
import { Text, Button, Divider } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    paddingTop: 16,
    paddingBottom: 16
  },
  title: {
    fontSize: 50,
    color: "#344340",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 20,
    color: "gray",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
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
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
})

const signInWithPlainAccount = async (credentials) => {
  const payload = {
    ...credentials
  }

  const handleError = (data) => {
    if (data.message === "INCORRECT_CREDENTIALS") {
      showMessage("Las credenciales que ingresaste son incorrectas")

      return true
    }

    return false
  }

  const session = await requestServer(
    "/users_service/sign_in_user_with_plain_account",
    payload,
    handleError
  )

  return session
}

const signInWithGoogleAccount = async (googleUniqueIdentifier) => {
  const payload = {
    google_unique_identifier: googleUniqueIdentifier
  }

  const handleError = (data) => {
    if (data.message === "GOOGLE_ACCOUNT_NOT_FOUND") {
      showMessage(
        "No hay ninguna cuenta registrada con la cuenta de Google que escogiste"
      )

      return true
    }

    return false
  }

  const session = await requestServer(
    "/users_service/sign_in_user_with_google_account",
    payload,
    handleError
  )

  return session
}

export default () => {
  const navigation = useNavigation()
  const [_, setSession] = useAtom(sessionAtom)

  const handleSignInWithPlainAccount = () => {
    if (form.hasErrors()) {
      showMessage(
        "Ingresa la información necesaria para iniciar sesión"
      )

      return
    }

    signInWithPlainAccountMutation.mutate({ credentials: form.fields })
  }

  const handleSignInWithGoogleAccount = (userInformation) => {
    const googleUniqueIdentifier = userInformation["id"]

    signInWithGoogleAccountMutation.mutate({ googleUniqueIdentifier })
  }

  const form = useForm(
    {
      email: "",
      password: ""
    },
    {
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )
  const signInWithPlainAccountMutation = useMutation(
    ({ credentials }) => signInWithPlainAccount(credentials)
  )
  const signInWithGoogleAccountMutation = useMutation(
    ({ googleUniqueIdentifier }) => signInWithGoogleAccount(googleUniqueIdentifier)
  )

  const signInData =
    signInWithPlainAccountMutation.isSuccess ?
    signInWithPlainAccountMutation.data :
    (
      signInWithGoogleAccountMutation.isSuccess ?
      signInWithGoogleAccountMutation.data :
      null
    )
  const isSignInLoading = (
    (signInWithPlainAccountMutation.isLoading) ||
    (signInWithGoogleAccountMutation.isLoading)
  )

  useEffect(() => {
    if (signInData !== null) {
      setSession({
        token: signInData.token,
        customerId: signInData.user_id
      })

      navigation.navigate("Home")
    }
  }, [signInData])

  return (
    <Screen>
      <Text style={styles.title}>
        Bienvenido
      </Text>

      <Text style={styles.subtitle}>
        ¡Inicia sesión para comenzar!
      </Text>

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

      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSignInWithPlainAccount}
        disabled={form.hasErrors() || isSignInLoading}
      >
        {
          signInWithPlainAccountMutation.isLoading
          ? (
            <LoadingSpinner />
          )
          : "Iniciar sesión"
        }
      </Button>

      <Divider style={{ width: "90%" }} />

      <Text style={styles.thirdText}>
        O también
      </Text>

      {
        signInWithGoogleAccountMutation.isLoading ?
        <LoadingSpinner /> :
        <GoogleSignInButton
          text="Continúa con Google"
          onSignIn={handleSignInWithGoogleAccount}
          disabled={isSignInLoading}
        />
      }
    </Screen>
  )
}
