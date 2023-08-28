import { View, StyleSheet } from 'react-native'
import { ActivityIndicator } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  }
})

export default ({ inScreen }) => {
  const containerStyle = {
    flex: inScreen ? 1 : undefined,
    ...styles.container
  }

  return (
    <View style={containerStyle}>
      <ActivityIndicator
        animating
        size={inScreen ? 96 : "small"}
      />
    </View>
  )
}
