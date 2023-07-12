import { View, TextInput, HelperText } from 'react-native-paper'

export default ({error, ...textInputProps}) => {
  return (
    <View>
      <TextInput
        {...textInputProps}
        mode="outlined"
        error={(error !== null) && (error !== undefined)}
      />

      <HelperText type="error" visibler={isErrorVisible}>
        {error}
      </HelperText>
    </View>
  )
}
