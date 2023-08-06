import { List , Avatar } from 'react-native-paper'

export default ({ comment }) => {
  return (
    <List.Item
      title={`${comment.user_name} (${comment.publication_date})`}
      description={comment.text}
      left={(props) => {
        return (
          <Avatar
            {...props}
            source={{uri: comment.user_picture}}
          />
        )
      }}
    />
  )
}
