import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import { useCounter } from '../utilities/hooks'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Portal,
  Modal,
  Surface,
  FAB
} from 'react-native-paper'
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions
} from 'react-native'

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.75,
    left: Dimensions.get("screen").width * 0.8
  },
  searchBarModal: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1
  },
  postsListContainer: {
    justifyContent: "space-evenly",
    gap: 16,
    padding: 16
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
  const postsQuery = useQuery({
    queryKey: ["feedPosts"],
    queryFn: () => fetchPosts(session.customerId, pageNumber.value)
  })

  if (postsQuery.isLoading) {
    return (
      <View style={{ height: Dimensions.get("screen").height }}>
        <LoadingSpinner inScreen />
      </View>
    )
  }

  return (
    <FlatList
      contentContainerStyle={styles.postsListContainer}
      data={postsQuery.data}
      renderItem={({ item }) => <PostTile post={item} />}
      keyExtractor={(post) => post.post_id}
    />
  )
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigation = useNavigation()

  const handleSearchSubmit = (text, categoriesNames, storesNames) => {
    setIsModalVisible(false)

    navigation.navigate("SearchResults", {
      text,
      categoriesNames,
      storesNames
    })
  }

  return (
    <SafeAreaView>
      <PostsList />

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.searchBarModal}
        >
          <Surface elevation={5}>
            <SearchBar onSearchSubmit={handleSearchSubmit} />
          </Surface>
        </Modal>
      </Portal>

      <FAB
        icon="magnify"
        onPress={() => setIsModalVisible(true)}
        style={styles.fab}
      />
    </SafeAreaView>
  )
}
