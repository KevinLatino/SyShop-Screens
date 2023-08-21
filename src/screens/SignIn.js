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
import EStyleSheet from 'react-native-extended-stylesheet'
import { View } from 'react-native'
import { Text, Button, Divider } from 'react-native-paper'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    gap: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16
  },
  Image:{
    with: 300, //grasa
    height: 300, //grasa
    display:  "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    color: "#344340",
    fontWeight: "bold",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
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
    ({ ...credentials }) => signInWithPlainAccount(credentials)
  )
  const signInWithGoogleAccountMutation = useMutation(
    ({ googleUniqueIdentifier }) => signInWithGoogleAccount(googleUniqueIdentifier)
  )

  const handleSignInWithPlainAccount = () => {
    if (form.hasErrors()) {
      showMessage(
        "Por favor provee la información necesaria para iniciar sesión"
      )

      return
    }

    signInWithPlainAccountMutation.mutate({ credentials: form.fields })
  }

  const handleSignInWithGoogleAccount = (userInformation) => {
    const googleUniqueIdentifier = userInformation["id"]

    signInWithGoogleAccountMutation.mutate({ googleUniqueIdentifier })
  }

  const isSignInLoading = (
    (signInWithPlainAccountMutation.isLoading) ||
    (signInWithGoogleAccountMutation.isLoading)
  )

  const signInData =
    signInWithPlainAccountMutation.isSuccess ?
    signInWithPlainAccountMutation.data :
    (
      signInWithGoogleAccountMutation.isSuccess ?
      signInWithGoogleAccountMutation.data :
      null
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
    <View style={styles.container}>

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
        signInWithGoogleAccountMutation.isLoading
        ? (
          <LoadingSpinner />
        )
        : (
          <GoogleSignInButton
            text="Continúa con Google"
            onSignIn={handleSignInWithGoogleAccount}
            disabled={isSignInLoading}
          />
        )
      }
    </View>
  )
}
