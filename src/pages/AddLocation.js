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
      <Text style={styles.title}>Añade un nuevo domicilio</Text>

      <Text style={styles.subtitle}>Ingresa los datos</Text>

      <TextInput style={styles.TextInput} placeholder="Código postal" />

      <TextInput style={styles.TextInput} placeholder='Provincia' />

      <TextInput style={styles.TextInput} placeholder='Cantón' />

      <TextInput style={styles.TextInput} placeholder='Distrito' />

      <TextInput style={styles.TextInput} placeholder='Barrio, residencial, condominio, apartamento, etc...' />


      <Button
        mode="contained"
      >
        Continuar
      </Button>

      <StatusBar style="auto" />
    </View>
  );
}


