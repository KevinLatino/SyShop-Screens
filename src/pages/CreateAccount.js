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

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea una cuenta</Text>

      <Text style={styles.subtitle}>Rellena tus datos personales</Text>

      <TextInput style={styles.TextInput} placeholder="Nombre" />

      <TextInput style={styles.TextInput} placeholder='Primer apellido' />

      <TextInput style={styles.TextInput} placeholder='Segundo apellido' />

      <TextInput style={styles.TextInput} placeholder='Correo eléctronico' />

      <TextInput style={styles.TextInput} placeholder='Número telefónico' />

      <TextInput
        style={styles.TextInput}
        secureTextEntry
        placeholder='Contraseña'
      />

      <Button
        mode="contained"
      >
        Crear cuenta
      </Button>

      <StatusBar style="auto" />
    </View>
  );
}
