import { useState } from 'react'
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
  const [height, setHeight] = useState(undefined)

  return (
    <View>
      <TextInput
        {...textInputProps}
        style={{
          ...styles.textInput,
          height
        }}
        mode="outlined"
        error={(error !== null) && (error !== undefined)}
        onContentSizeChange={
          (event) => setHeight(event.nativeEvent.contentSize.height)
        }
      />

      <HelperText type="error" visibler={(error !== null) && (error !== undefined)}>
        {error}
      </HelperText>
    </View>
  )
}
