import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black'
  },
  title: {
    fontSize: 35,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 40,
    textAlign: 'center'
  },
  buttonContainer: {
    paddingHorizontal: 20
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#c20000',
    paddingVertical: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>¡Empieza a comprar!</Text>
        <Text style={styles.subtitle}>
          ¡Inicia sesión o regístrate para encontrar el artículo que buscas y comprarlo en cuestión de minutos!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
