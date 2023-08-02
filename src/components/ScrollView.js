import { View, FlatList } from 'react-native'
import { Divider, ActivityIndicator } from 'react-native-paper'

export default ({ data, ...flatListProps }) => {
  if (data === null) {
    return (
      <View>
        <ActivityIndicator animating />
      </View>
    )
  }

  return (
    <FlatList
      data={data}
      {...flatListProps}
      ItemSeparatorComponent={<Divider />}
      onStartReachedThreshold={0.1}
      onEndReachedThreshold={0.1}
    />
  )
}
