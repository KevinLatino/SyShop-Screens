import { View, Text, FlatList, StyleSheet } from 'react-native'
import { Divider, IconButton } from 'react-native-paper'

const styles = StyleSheet.create({
  emptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

const Empty = ({ icon, message }) => {
  return (
    <View style={styles.emptyComponent}>
      <IconButton disabled icon={icon} size={50} />

      <Text variant="bodySmall" color="#f0f0f0">
        {message}
      </Text>
    </View>
  )
}

export default ({ data, emptyMessage, emptyIcon, ...flatListProps }) => {
  return (
    <FlatList
      data={data}
      {...flatListProps}
      ItemSeparatorComponent={<Divider />}
      ListEmptyComponent={<Empty icon={emptyIcon} message={emptyMessage} />}
    />
  )
}
