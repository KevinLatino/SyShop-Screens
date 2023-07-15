import { useState } from 'react'
import { Card, Divider, Chip, IconButton, Text } from 'react-native-paper'

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

const likePost = (post_id, customer_id) => {
  // Esto es temporal hasta que guarden las sesiones en el localStorage
  console.log(`Customer (id=${customer_id}) liked post (id=${post_id})`)
}

export default ({ post }) => {
  const [doesCustomerLikePost, setDoesCustomerLikePost] = useState(
    post.does_customer_like_post
  )

  const handleLikePress = () => {
    likePost(post.post_id, "")

    setDoesCustomerLikePost(!doesCustomerLikePost)
  }

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
        <IconButton
          mode="contained"
          icon={doesCustomerLikePost ? "heart" : "heart-outline"}
          onPress={handleLikePress}
        />
      </Card.Actions>
    </Card>
  )
}
