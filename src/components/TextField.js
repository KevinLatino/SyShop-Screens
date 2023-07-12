import { View, TextInput, HelperText } from 'react-native-paper'

export default ({error, isErrorVisible, ...textInputProps}) => {
  return (
    <View>
      <TextInput
        {...textInputProps}
        mode="outlined"
        error={isErrorVisible}
      />

      <HelperText type="error" visibler={isErrorVisible}>
        {error}
      </HelperText>
    </View>
  )
}
