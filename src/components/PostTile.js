import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
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

const likePost = async (postId, customerId) => {
  const payload = {
    customer_id: customerId,
    post_id: postId
  }
  const _ = await requestServer(
    "/posts_service/like_post",
    payload
  )
}

export default ({ post }) => {
  const [session, _] = useAtom(sessionAtom)
  const likePostMutation = useMutation(
    () => likePost(post.post_id, session.customerId)
  )
  const [isLiked, setIsLiked] = useState(post.does_customer_like_post)

  const handleLike = () => {
    likePostMutation.mutate()

    setIsLiked(!isLiked)
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
        {
          likePostMutation.isLoading ?
          <LoadingSpinner /> :
          <IconButton
            mode="contained"
            icon={isLiked ? "heart" : "heart-outline"}
            onPress={handleLike}
          />
        }
      </Card.Actions>
    </Card>
  )
}
