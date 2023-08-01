import { useState } from 'react'
import { requestServer, useQuery } from '../utilities/requests'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { useNavigation } from '@react-navigation/native'
import useCounter from '../hooks/useCounter'
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
  const postsQuery = useQuery(() => fetchPosts(session.customerId, pageNumber))

  if (postsQuery.result === null) {
    return (
      <View>
        <ActivityIndicator animating />
      </View>
    )
  }

  return (
    <ScrollView
      data={postsQuery.result}
      renderItem={(post) => <PostTile post={post} />}
      onStartReached={postsQuery.refresh}
      onEndReached={pageNumber.increment}
    />
  )
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigation = useNavigation()

  const navigateToSearchResults = (text, categoriesNames, storesNames) => {
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
            <SearchBar onSearchSubmit={navigateToSearchResults} />
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
