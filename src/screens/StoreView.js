import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useCounter } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import PostTile from '../components/PostTile'
import { View, StyleSheet } from 'react-native'
import { Appbar, Divider } from 'react-native-paper'
import { ImageSlider } from 'react-native-image-slider-banner'

const styles = StyleSheet.create({
  container: {
    gap: 16
  }
})

const fetchStore = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const store = await requestServer(
    "/stores_service/get_store_by_id",
    payload
  )

  return store
}

const fetchStorePosts = async (storeId, customerId, pageNumber) => {
  const payload = {
    start: pageNumber * 10,
    amount: 10,
    store_id: storeId,
    customer_id: customerId
  }
  const posts = await requestServer(
    "/posts_service/get_store_posts",
    payload
  )

  return posts
}

const fetchChat = async (customerId, storeId) => {
  const payload = {
    sender_id: customerId,
    receiver_id: storeId
  }
  const optionChat = await requestServer(
    "/chat_service/get_chat_by_sender_and_receiver",
    payload
  )

  return optionChat
}

const followStore = async (storeId, customerId) => {
  const payload = {
    store_id: storeId,
    customer_id: customerId
  }
  const _ = await requestServer(
    "/stores_service/follow_store",
    payload
  )
}

const StoreView = ({ storeId, customerId }) => {
  const navigation = useNavigation()
  const [session, _] = useAtom(sessionAtom)
  const storeQuery = useQuery({
    queryKey: ["store"],
    queryFn: () => fetchStore(storeId)
  })
  const followStoreMutation = useMutation(
    (storeId, customerId) => followStore(storeId, customerId)
  )

  if (storeQuery.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  const {
    name,
    description,
    multimedia,
    location,
    follower_count,
    does_customer_follow_store
  } = storeQuery.data
  const [isFollowing, setIsFollowing] = useState(does_customer_follow_store)

  const handleFollow = () => {
    followStoreMutation.mutate(storeId, customerId)

    setIsFollowing(!isFollowing)
  }

  const navigateToChat = async () => {
    const optionalChat = await fetchChat(session.customerId, storeId)

    const chatId = optionalChat?.chat_id

    navigation.navigate("Chat", {
      chat_id: chatId,
      user: {
        user_id: storeId,
        name: storeQuery.data.name,
        picture: storeQuery.data.picture
      }
    })
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={name} />

        <Appbar.Action
          icon="chat"
          onPress={navigateToChat}
        />

        <Appbar.Action
          icon={isFollowing ? "check" : "plus"}
          onPress={handleFollow}
        />
      </Appbar.Header>

      <View>
        <ImageSlider
          data={multimedia}
          autoPlay={false}
        />

        <Text variant="titleMedium">
          {formatLocation(location)}
        </Text>

        <Text variant="bodySmall">
          {`${follower_count} ${follower_count > 1 ? 'followers' : 'follower'}`}
        </Text>

        <Text variant="bodyLarge">
          {description}
        </Text>
      </View>
    </View>
  )
}

const PostsList = ({ storeId, customerId }) => {
  const pageNumber = useCounter()
  const storePostsQuery = useQuery({
    queryKey: ["storePosts"],
    queryFn: () => fetchStorePosts(storeId, customerId, pageNumber.value)
  })

  if (storePostsQuery.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <ScrollView
      data={storePostsQuery.data}
      keyExtractor={(post) => post.post_id}
      renderItem={(post) => <PostTile post={post} />}
      onEndReached={pageNumber.increment}
    />
  )
}

export default () => {
  const route = useRoute()
  const [session, _] = useAtom(sessionAtom)

  const { storeId } = route.params

  return (
    <View style={styles.container}>
      <StoreView
        storeId={storeId}
        customerId={session.customerId}
      />

      <Divider />

      <PostsList
        storeId={storeId}
        customerId={session.customerId}
      />
    </View>
  )
}
