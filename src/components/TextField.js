import { View, TextInput, StyleSheet } from 'react-native'
import { HelperText } from 'react-native-paper'

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    paddingStart: 20,
    borderColor: "gray",
    padding: 10,
    width: 250,
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default ({ error, ...textInputProps }) => {
  return (
    <View>
      <TextInput
        {...textInputProps}
        style={styles.textInput}
        mode="outlined"
        error={(error !== null) && (error !== undefined)}
      />

      <HelperText type="error" visibler={(error !== null) && (error !== undefined)}>
        {error}
      </HelperText>
    </View>
  )
}
