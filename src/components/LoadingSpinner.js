import { View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { ActivityIndicator } from "react-native-paper";

const styles = EStyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  }
})

export default () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating />
    </View>
  )
}
