import { StatusBar } from 'expo-status-bar'
import { StyleSheet, TextInput, Text, View } from 'react-native'
import { Button } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    color: "#ff4040",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 20,
    color: "gray",
  },
  TextInput: {
    borderWidth: 1,
    paddingStart: 30,
    borderColor: "grey",
    padding: 10,
    color: "#344340",
    width: "80%",
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "#fff"
  }
});

const signUpWithPlainAccount = async (userInformation) => {
  const apiUrl = formatApiUrl("/users_service/sign_up_customer_with_plain_account")

  const { data, statusText } = await axios.post(apiUrl, userInformation)

  if (statusText !== "OK") {
    throw Error("Could not sign up the customer with a plain account")
  }

  const sessionToken = data.token

  localStorage.setItem("sessionToken", sessionToken)
}

export default () => {
  const [userInformation, setUserInformation] = useState({
    name: "",
    first_surname: "",
    second_surname: "",
    phone_number: "",
    picture: "",
    email: "",
    password: ""
  })

  const handleSignUp = (_) => {
    try {
      signUpWithPlainAccount(userInformation)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea una cuenta</Text>

      <Text style={styles.subtitle}>Rellena tus datos personales</Text>

      <TextInput
        onChangeText={(text) => setUserInformation({...userInformation, name: text})}
        text={userInformation.name}
        style={styles.TextInput}
        placeholder="Nombre"
      />

      <TextInput
        onChangeText={(text) => setUserInformation({...userInformation, first_surname: text})}
        text={userInformation.first_surname}
        style={styles.TextInput}
        placeholder='Primer apellido'
      />

      <TextInput
        onChangeText={(text) => setUserInformation({...userInformation, second_surname: text})}
        text={userInformation.second_surname}
        style={styles.TextInput}
        placeholder='Segundo apellido'
      />

      <TextInput
        onChangeText={(text) => setUserInformation({...userInformation, email: text})}
        text={userInformation.email}
        style={styles.TextInput}
        placeholder='Correo eléctronico'
      />

      <TextInput
        onChangeText={(text) => setUserInformation({...userInformation, phone_number: text})}
        text={userInformation.phone_number}
        style={styles.TextInput}
        placeholder='Número telefónico'
      />

      <TextInput
        onChangeText={(text) => setUserInformation({...userInformation, password: text})}
        text={userInformation.password}
        style={styles.TextInput}
        secureTextEntry
        placeholder='Contraseña'
      />

      <Button
        mode="contained"
        onPress={handleSignUp}
      >
        Crear cuenta
      </Button>

      <StatusBar style="auto" />
    </View>
  );
}
