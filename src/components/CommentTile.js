import { formatDate, formatBase64String } from '../utilities/formatting'
import { List, Avatar } from 'react-native-paper'
import configuration from '../configuration'

export default ({ comment }) => {
  return (
    <List.Item
      titleStyle={{
        color: configuration.SECONDARY_COLOR,
        fontSize: 14
      }}
      descriptionStyle={{
        color: "silver",
        fontSize: 13
      }}
      title={comment.text}
      description={`${comment.user_name} • ${formatDate(comment.publication_date)}`}
      left={(props) => <Avatar.Image
        {...props}
        source={{ uri: formatBase64String(comment.user_picture)}}
        size={50}
        />
      }
      titleNumberOfLines={3}
    />
  )
}
