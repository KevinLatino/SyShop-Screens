import { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { HelperText } from 'react-native-paper'

const styles = StyleSheet.create({
  textInput: {
    padding: 20,
    width: 275,
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    color: "black"
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
