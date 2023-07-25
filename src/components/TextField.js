import { View, TextInput, StyleSheet } from 'react-native'
import { HelperText } from 'react-native-paper'

const styles = StyleSheet.create({
  textInput: {
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
