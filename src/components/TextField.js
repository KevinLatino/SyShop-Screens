import { View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

export default ({error, ...textInputProps}) => {
  return (
    <View>
      <TextInput
        {...textInputProps}
        mode="outlined"
        error={(error !== null) && (error !== undefined)}
      />

      <HelperText type="error" visibler={(error !== null) && (error !== undefined)}>
        {error}
      </HelperText>
    </View>
  )
}
