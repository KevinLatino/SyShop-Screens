import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { useCounter } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import PostTile from '../components/PostTile'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'
import { ImageSlider } from 'react-native-image-slider-banner'

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
  const storeQuery = useQuery({
    queryKey: "store",
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

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={name} />

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
    queryKey: "storePosts",
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
    <View>
      <StoreView
        storeId={storeId}
        customerId={session.customerId}
      />

      <PostsList
        storeId={storeId}
        customerId={session.customerId}
      />
    </View>
  )
}
