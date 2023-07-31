import { useState } from 'react'
import { requestServer, useQuery } from '../utilities/requests'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import useCounter from '../hooks/useCounter'
import { Portal, Modal, FAB, Searchbar } from 'react-native-paper'
import ScrollView from '../components/ScrollView'
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

  return (
    <View>
      {
        postsQuery.result !== null
        ? <ScrollView
          onStartReached={postsQuery.refresh}
          onEndReached={pageNumber.increment}
        />
        : null
      }
    </View>
  )
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <View>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
        >
          <Searchbar />
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
