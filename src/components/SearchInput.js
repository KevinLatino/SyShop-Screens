import { StyleSheet } from 'react-native'
import { SearchBar } from 'react-native-elements'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  inputContainer: {
    backgroundColor: '#f0f0f0f',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
    flex: 1
  },
  input: {
    fontSize: 16
  }
})

export default ({ ...searchBarProps }) => {
  return (
    <SearchBar
      {...searchBarProps}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.inputStyle}
    />
  )
}
