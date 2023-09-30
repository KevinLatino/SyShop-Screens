import { StyleSheet } from 'react-native'
import { Button, Headline } from 'react-native-ios-kit'

const styles = StyleSheet.create({
  text: {
    color: "#ffffff",
    textAlign: "center"
  }
})

export default ({ children , ...iosButtonProps }) => {
  return (
    <Button
      centered
      inverted
      rounded
      {...iosButtonProps}
    >
      <Headline style={styles.text}>
        {children}
      </Headline>
    </Button>
  )
}
