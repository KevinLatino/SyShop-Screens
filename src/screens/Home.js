import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import { useCounter } from '../utilities/hooks'
import {
  Portal,
  Modal,
  Surface,
  FAB,
  ActivityIndicator
} from 'react-native-paper'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    margin: 15
  }
})

const fetchPosts = async (customerId, pageNumber) => {
  const payload = {
    customer_id: customerId,
    start: pageNumber * 20,
    amount: (pageNumber + 1) * 20
  }
  const posts = await requestServer(
    "/posts_service/get_posts_from_customer_following_stores",
    payload
  )

  return posts
}

const PostsList = () => {
  const pageNumber = useCounter()
  const [session, _] = useAtom(sessionAtom)
  const postsQuery = useQuery(
    "feedPosts",
    () => fetchPosts(session.customerId, pageNumber.value)
  )

  if (postsQuery.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <ScrollView
      data={postsQuery.data}
      renderItem={(post) => <PostTile post={post} />}
      onStartReached={postsQuery.refresh}
      onEndReached={pageNumber.increment}
    />
  )
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigation = useNavigation()

  const handleSearchSubmit = (text, categoriesNames, storesNames) => {
    navigation.navigate("SearchResults", {
      text,
      categoriesNames,
      storesNames
    })
  }

  return (
    <View>
      <PostsList />

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
        >
          <Surface elevation={5}>
            <SearchBar onSearchSubmit={handleSearchSubmit} />
          </Surface>
        </Modal>
      </Portal>

      <FAB
        icon="magnify"
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      />
    </View>
  )
}