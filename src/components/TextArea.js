import { useState } from 'react'
import { TextInput, StyleSheet } from 'react-native'

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

export default ({ ...textInputProps }) => {
  const [height, setHeight] = useState(undefined)

  return (
    <TextInput
      {...textInputProps}
      style={{
        ...styles.textInput,
        height
      }}
      multiline
      onContentSizeChange={
        (event) => setHeight(event.nativeEvent.contentSize.height)
      }
    />
  )
}
