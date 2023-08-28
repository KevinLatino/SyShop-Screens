import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { showMessage } from '../components/AppSnackBar'
import { requestServer } from '../utilities/requests'
import {
  makeNotEmptyChecker,
  checkEmail,
  checkPhoneNumber
} from '../utilities/validators'
import TextField from '../components/TextField'
import GoogleSignInButton from '../components/GoogleSignInButton'
import LoadingSpinner from '../components/LoadingSpinner'
import PictureInput from '../components/PictureInput'
import {
  View,
  StyleSheet,
  ScrollView as ReactNativeScrollView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, Divider } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16
  },
  inputsContainer: {
    flex: 1,
    gap: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  const [useUrlPicture, setUseUrlPicture] = useState(false)
  const [googleUniqueIdentifier, setGoogleUniqueIdentifier] = useState(null)
  const [picture, setPicture] = useState(null)
  const form = useForm(
    {
      name: "",
      first_surname: "",
      second_surname: "",
      phone_number: "",
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
    (userInformation) => signUpWithPlainAccount(userInformation)
  )
  const signUpWithGoogleAccountMutation = useMutation(
    ({ googleUniqueIdentifier, ...userInformation }) => signUpWithGoogleAccount(
      userInformation, googleUniqueIdentifier
    )
  )

  const signUpData =
    signUpWithPlainAccountMutation.isSuccess ?
    signUpWithPlainAccountMutation.data :
    (
      signUpWithGoogleAccountMutation.isSuccess ?
      signUpWithGoogleAccountMutation.data :
      null
    )

  useEffect(() => {
    if (signUpData !== null) {
      setSession({
        token: signUpData.token,
        customerId: signUpData.user_id
      })

      navigation.navigate("Home")
    }
  }, [signUpData])

  const isSignUpLoading = (
    (signUpWithPlainAccountMutation.isLoading) ||
    (signUpWithGoogleAccountMutation.isLoading)
  )

  const handleSignUp = () => {
    if (form.hasErrors()) {
      showMessage("Por favor provee la información necesaria para registrarte")

      return
    }

    if (signingUpWithPlainAccount) {
      signUpWithPlainAccountMutation.mutate({
        picture,
        ...form.fields
      })
    } else {
      signUpWithGoogleAccountMutation.mutate({
        googleUniqueIdentifier,
        picture,
        ...form.fields
      })
    }
  }

  const handleChangePicture = (newPicture) => {
    setUseUrlPicture(false)
    setPicture(newPicture)
  }

  const fillUpFormWithGoogleData = (userInformation) => {
    const [firstSurname, secondSurname] = userInformation.family_name.split(" ", 2)

    form.setField("second_surname") (secondSurname)
    form.setField("first_surname") (firstSurname)
    form.setField("name") (userInformation.given_name)

    setPicture(_ => userInformation.picture)
    setSigninUpWithPlainAccount(_ => false)
    setUseUrlPicture(_ => true)
    setGoogleUniqueIdentifier(_ => userInformation.id)
  }

  return (
    <ReactNativeScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Registrarse
        </Text>

        <Text style={styles.subtitle}>
          Ingresa tus datos personales
        </Text>

        <PictureInput
          picture={picture}
          onChangePicture={handleChangePicture}
          useUrl={useUrlPicture}
        />

        <View style={styles.inputsContainer}>
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
            keyboardType="numeric"
          />

          {
            signingUpWithPlainAccount ?
            (
              <View style={styles.inputsContainer}>
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
            ) :
            null
          }
        </View>

        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSignUp}
        >
          {
            isSignUpLoading ?
            <LoadingSpinner /> :
            "Registrarse"
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
      </SafeAreaView>
    </ReactNativeScrollView>
  )
}
