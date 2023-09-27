import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FlatList, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
  }
})

const VirtualizedView = ({ children })  => {
  return (
    <FlatList
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={() => (
        <React.Fragment>
          {children}
        </React.Fragment>
      )}
    />
  )
}

export default ({ children, ...safeAreaViewProps }) => {
  return (
    <VirtualizedView>
      <KeyboardAwareScrollView>
        <SafeAreaView
          style={styles.container}
          {...safeAreaViewProps}
        >
          {children}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </VirtualizedView>
  )
}
