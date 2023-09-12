import { useNavigation } from '@react-navigation/native'
import LikeButton from './LikeButton'
import { View } from 'react-native'
import {
  Card,
  Chip,
  Text,
  IconButton
} from 'react-native-paper'

const styles = {
  extraInformationView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "100%"
  },
  contentView: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    gap: 12
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
  const navigation = useNavigation()

  const categoriesChips = post
      .categories
      .map((category, index) => {
        return (
          <Chip mode="flat" key={index}>
            {category}
          </Chip>
        )
      })
  const likesText = `${post.likes} ${post.likes === 1 ? "like" : "likes"}`

  const navigateToPostView = () => {
    navigation.navigate("PostView", {
      postId: post.post_id
    })
  }

  const navigateToStoreView = () => {
    navigation.navigate("StoreView", {
      storeId: post.store_id
    })
  }

  return (
    <Card elevation={5}
      onPress={navigateToPostView}
    >
      <Card.Cover src={post.multimedia[0]} />
      <Card.Title
        title={post.title}
        subtitle={formatPostSubtitle(post)}
        titleVariant="titleLarge"
        subtitleVariant="titleMedium"
      />
      
      <Card.Content style={styles.contentView}>
        <Text variant="bodyLarge">
          {post.description}
        </Text>

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
          icon="store"
          onPress={navigateToStoreView}
        />

        <LikeButton
          postId={post.post_id}
          doesCustomerLikePost={post.does_customer_like_post}
        />
      </Card.Actions>
    </Card>
  )
}
