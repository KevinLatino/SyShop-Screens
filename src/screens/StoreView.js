import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatLocation } from '../utilities/formatting'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import PostTile from '../components/PostTile'
import Screen from '../components/Screen'
import { View } from 'react-native'
import { Appbar, Text, Divider } from 'react-native-paper'
import { ImageSlider } from 'react-native-image-slider-banner'

const fetchStore = async (storeId, customerId) => {
  const payload = {
    store_id: storeId,
    customer_id: customerId
  }
  const store = await requestServer(
    "/stores_service/get_store_by_id",
    payload
  )

  return store
}

const fetchStorePosts = async (storeId, customerId) => {
  const payload = {
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
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [isFollowing, setIsFollowing] = useState(null)

  const handleQuerySuccess = (data) => {
    setIsFollowing(data.does_customer_follow_store)
  }

  const handleFollow = () => {
    followStoreMutation.mutate({
      storeId,
      customerId
    })

    setIsFollowing(!isFollowing)
  }

  const handleFollowSuccess = (_) => {
    queryClient.refetchQueries({
      queryKey: ["feedPosts"]
    })
  }

  const navigateToChat = async () => {
    const optionalChat = await fetchChat(session.data.customerId, storeId)

    const chatId = optionalChat?.chat_id

    navigation.navigate("Chat", {
      chat: {
        chat_id: chatId,
        user: {
          user_id: storeId,
          name: storeQuery.data.name,
          picture: storeQuery.data.picture
        }
      }
    })
  }

  const storeQuery = useQuery({
    queryKey: ["store"],
    queryFn: () => fetchStore(storeId, session.data.customerId),
    onSuccess: handleQuerySuccess,
    disabled: session.isLoading
  })
  const followStoreMutation = useMutation(
    ({ storeId, customerId }) => followStore(storeId, customerId),
    {
      onSuccess: handleFollowSuccess
    }
  )

  if (storeQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const {
    name,
    description,
    multimedia,
    location,
    follower_count
  } = storeQuery.data

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={name} />

        <Appbar.Action
          icon="chat"
          onPress={navigateToChat}
        />

        <Appbar.Action
          disabled={isFollowing === null}
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
  const storePostsQuery = useQuery({
    queryKey: ["storePosts"],
    queryFn: () => fetchStorePosts(storeId, customerId)
  })

  if (storePostsQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <ScrollView
      data={storePostsQuery.data}
      keyExtractor={(post) => post.post_id}
      renderItem={({ item }) => <PostTile post={item} />}
      emptyIcon="basket"
      emptyMessage="Esta tienda no ha hecho ninguna publicación"
    />
  )
}

export default () => {
  const route = useRoute()
  const [session, _] = useSession()

  const { storeId } = route.params

  if (session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Screen>
      <StoreView
        storeId={storeId}
        customerId={session.data.customerId}
      />

      <Divider />

      <PostsList
        storeId={storeId}
        customerId={session.data.customerId}
      />
    </Screen>
  )
}
