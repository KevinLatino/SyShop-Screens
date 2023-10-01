import Empty from './Empty'
import { FlatList } from 'react-native'
import { Divider } from 'react-native-paper'

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
