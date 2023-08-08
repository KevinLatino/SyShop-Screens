import { useState } from 'react'
import { useMutation, requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { makeNotEmptyChecker, checkEmail } from '../utilities/validation'
import { showMessage } from '../components/AppSnackBar'
import TextField from '../components/TextField'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { Text, Button, Divider } from 'react-native-paper'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

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

const signInWithPlainAccount = async (credentials) => {
  const payload = {
    ...credentials
  }
  const session = await requestServer(
    "/users_service/sign_in_user_with_plain_account",
    payload
  )

  return session
}

const signInWithGoogleAccount = async (googleUniqueIdentifier) => {
  const payload = {
    google_unique_identifier: googleUniqueIdentifier
  }
  const session = await requestServer(
    "/users_service/sign_in_user_with_google_account",
    payload
  )

  return session
}

export default () => {
  const navigation = useNavigation()
  const [_, setSession] = useAtom(sessionAtom)
  const [googleUniqueIdentifier, setGoogleUniqueIdentifier] = useState(null)
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
    (fields) => signInWithPlainAccount(fields)
  )
  const signInWithGoogleAccountMutation = useMutation(
    (googleUniqueIdentifier) => signInWithGoogleAccount(googleUniqueIdentifier)
  )

  const handleSignInWithPlainAccount = () => {
    if (form.hasErrors()) {
      showMessage(
        "Por favor provee la información necesaria para iniciar sesión"
      )

      return
    }

    signInWithPlainAccountMutation.execute()
  }

  const handleSignInWithGoogleAccount = (userInformation) => {
    setGoogleUniqueIdentifier(userInformation["id"])
  }

  const isSignInLoading = (
    (signInWithPlainAccountMutation.isLoading) ||
    (signInWithGoogleAccountMutation.isLoading)
  )

  const signInResult = 
    signInWithPlainAccountMutation.result !== null 
    ? signInWithPlainAccountMutation.result
    : signInWithGoogleAccountMutation.result

  if (googleUniqueIdentifier !== null) {
    signInWithPlainAccountMutation.execute()
  }

  if (signInResult !== null) {
    setSession({
      token: signInResult.token,
      customerId: signInResult.user_id
    })

    navigation.navigate("Home")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bienvenido
      </Text>

      <Text style={styles.subtitle}>
        ¡Inicia sesión para comenzar!
      </Text>

      <Divider style={{ width: "90%"}} />

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
        disabled={hasErrors() || isSignInLoading}
      >
        {
          signInWithPlainAccountMutation.isLoading
          ? (
            <View>
              <ActivityIndicator animating />
            </View>
          )
          : "Iniciar sesión"
        }
      </Button>

      <Divider style={{ width: "90%" }} />

      <Text style={styles.thirdText}>
        O también
      </Text>

      {
        signInWithGoogleAccountMutation.isLoading
        ? (
          <View>
            <ActivityIndicator animating />
          </View>
        )
        : (
          <GoogleSignInButton
            text="Iniciar sesión con google"
            onSignIn={handleSignInWithGoogleAccount}
            disabled={isSignInLoading}
          />
        )
      }
    </View>
  )
}
