import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
  }
})

export default ({ children, ...safeAreaViewProps }) => {
  return (
    <ScrollView>
      <SafeAreaView
        style={styles.container}
        {...safeAreaViewProps}
      >
        {children}
      </SafeAreaView>
    </ScrollView>
  )
}
