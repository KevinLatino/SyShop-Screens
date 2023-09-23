import { useQuery } from '@tanstack/react-query'
import { useCounter } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import ChatTile from '../components/ChatTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Screen from '../components/Screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Dimensions } from 'react-native'
import { Text } from 'react-native-paper'

const fetchChats = async (customerId, pageNumber) => {
  const payload = {
    start: pageNumber * 10,
    amount: 10,
    user_id: customerId
  }
  const chats = await requestServer(
    "/chat_service/get_user_chats",
    payload
  )

  return chats
}

export default () => {
  const [session, _] = useAtom(sessionAtom)
  const pageNumber = useCounter()
  const chatsQuery = useQuery({
    queryKey: ["listOfChats"],
    queryFn: () => fetchChats(session.customerId, pageNumber.value)
  })

  return (
    <Screen>
      <Text variant="titleLarge">
        Tus mensajes
      </Text>

      {
        chatsQuery.isLoading ?
        (
          <View style={{ height: Dimensions.get("window").height }}>
            <LoadingSpinner inScreen />
          </View>
        ) :
        <ScrollView
          data={chatsQuery.data}
          renderItem={({ item }) => <ChatTile chat={item} />}
          onEndReached={pageNumber.increment}
        />
      }
    </Screen>
  )
}
