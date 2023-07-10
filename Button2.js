import React from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ButtonCreateAccount(){
    return(
        <TouchableOpacity style={styles.container} >
         <LinearGradient
        colors={['#e00000', '#ff4040', "#ff7676"]}
        start={{x: 1, y: 0}}
        end={{x:0,  y: 1}}
        style={styles.button}
        >
        <Text style={styles.text}>Crear cuenta</Text>
      </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
     fontSize: 14, 
     color: "white",
     fontWeight: "bold"
    },
    button:{
  height: 50,
  width: "80%",
  marginTop: 20,
  borderRadius: 25,
  padding: 17,
  alignItems: "center",
  justifyContent: "center"
    },

  }); 