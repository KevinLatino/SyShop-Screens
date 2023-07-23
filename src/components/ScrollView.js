import { FlatList } from 'react-native'
import { Divider } from 'react-native-paper'

export default ({ ...flatListProps }) => {
  return (
    <FlatList
      {...flatListProps}
      ItemSeparatorComponent={<Divider />}
      onStartReachedThreshold={0.1}
      onEndReachedThreshold={0.1}
    />
  )
}
