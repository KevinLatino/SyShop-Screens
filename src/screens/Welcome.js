import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

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
      fontSize: 35,
      color: "#ffffff",
      fontFamily: "  'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontWeight: "bold",
      display: "flex",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "8rem",
    },
    subtitle: {
      fontSize: 20,
      color: "gray",
      display: "flex",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center"
    },
    Button: {
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

export default function () {

    return(
        <SafeAreaView style={{backgroundColor: "#c63637", width: "100hw", height: "100vh"}}>
 <View>
<Text style={styles.title}>¡Empieza a comprar!</Text>
</View>
        </SafeAreaView>
    )
}