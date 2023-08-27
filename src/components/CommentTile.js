import { formatBase64String } from '../utilities/formatting'
import { List, Avatar } from 'react-native-paper'

export default ({ comment }) => {
  return (
    <List.Item
      title={`${comment.user_name} (${comment.publication_date})`}
      description={comment.text}
      left={(props) => {
        return (
          <Avatar.Image
            {...props}
            source={{ uri: formatBase64String(comment.user_picture) }}
          />
        )
      }}
    />
  )
}
