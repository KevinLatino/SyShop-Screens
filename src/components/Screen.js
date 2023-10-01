import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FlatList, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
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
