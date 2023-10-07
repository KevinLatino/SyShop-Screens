import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import VirtualizedView from './VirtualizedView'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  }
})

export default ({ children, style, ...safeAreaViewProps }) => {
  return (
    <VirtualizedView>
      <KeyboardAwareScrollView>
        <SafeAreaView
          style={{
            ...styles.container,
            ...style
          }}
          {...safeAreaViewProps}
        >
          {children}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </VirtualizedView>
  )
}
