import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import React from 'react';
import ButtonGradient from './ButtonGradient';

export default function App() {
  return (
    <View style={styles.container}>
            <Text style={styles.title }>Bienvenido </Text>
      <Text style={styles.subtitle}>¡Inicia sesión para comenzar!</Text>
      <TextInput style={styles.TextInput} placeholder="Correo eléctronico"/>
      <TextInput secureTextEntry style={styles.TextInput} placeholder='Contraseña '/>
      <ButtonGradient></ButtonGradient>
      <StatusBar style="auto" />
    </View>
  );
}

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
  },
  button:{

  }
}); 
 
