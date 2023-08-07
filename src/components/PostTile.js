import { Card, Divider, Chip, Text } from 'react-native-paper'
import LikeButton from './LikeButton'

const styles = {
  extraInformationView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  categoriesView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "40%"
  }
}

const formatPostSubtitle = (post) => {
  const priceSubtitle = `₡${post.price}`
  const amountSubtitle = post.amount > 1 ? `x${post.amout}` : ""
  const subtitle = `${priceSubtitle} ${amountSubtitle}`

  return subtitle
}

export default ({ post }) => {
  const categoriesChips = post
      .categories
      .map((category) => {
        return (
          <Chip mode="flat">
            {category}
          </Chip>
        )
      })
  const likesText = `${post.likes} ${post.likes === 1 ? "like" : "likes"}`

  return (
    <Card>
      <Card.Cover src={post.multimedia[0]} />
      <Card.Title
        title={post.title}
        subtitle={formatPostSubtitle(post)}
      />
      
      <Card.Content>
        <Text variant="bodySmall">
          {post.description}
        </Text>

        <Text variant="bodyMedium">
          {post.description}
        </Text>

        <Divider /> 

        <View style={styles.extraInformationView}>
          <View style={styles.categoriesView}>
            {categoriesChips}
          </View>
          
          <Text variant="bodyMedium">
            {likesText}
          </Text>
        </View>
      </Card.Content>

      <Card.Actions>
        <LikeButton
          doesCustomerLikePost={post.does_customer_like_post}
        />
      </Card.Actions>
    </Card>
  )
}
