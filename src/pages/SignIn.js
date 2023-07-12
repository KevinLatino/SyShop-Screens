import axios from 'axios'
import React, { useState } from 'react'
import { StyleSheet, TextInput, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, Divider } from 'react-native-paper'
import formatApiUrl from '../utilities/format-api-url.js'
import GoogleSignInButton from '../components/GoogleSignInButton.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1 ',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    color: "#344340",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 20,
    color: "gray",
  }, 
  TextInput: {
    borderWidth: 1, 
    paddingStart: 30,
    borderColor: "gray",
    padding: 10,
    width: "80%",
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "#fff"
  }
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
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignIn = (_) => {
    try {
      signInWithPlainAccount(email, password)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>

      <Text style={styles.subtitle}>¡Inicia sesión para comenzar!</Text>

      <TextInput
        text={email}
        onChangeText={setEmail}
        style={styles.TextInput}
        placeholder="Correo eléctronico"
      />

      <TextInput
        text={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.TextInput}
        placeholder='Contraseña'
      />

      <Button
        mode="contained"
        onPress={handleSignIn}
      >
        Iniciar sesión
      </Button>

      <GoogleSignInButton
        setUserInformation={(userInformation) => console.log(userInformation)}
      />

      <StatusBar style="auto" />
    </View>
  );
}
