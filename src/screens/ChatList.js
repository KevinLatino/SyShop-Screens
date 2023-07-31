import { useAtom } from 'jotai'
import { useCounter } from '../hooks/useCounter'
import { sessionAtom } from '../context'
import { requestServer, useQuery } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import ChatTile from '../components/ChatTile'
import { View, ActivityIndicator } from 'react-native'

const fetchChats = async (customerId, pageNumber) => {
  const payload = {
    start: pageNumber * 10,
    amount: 10,
    customer_id: customerId
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
  const chatsQuery = useQuery(
    () => fetchChats(session.customerId, pageNumber.value)
  )

  if (chatsQuery.result === null) {
    return (
      <View>
        <ActivityIndicator animating />
      </View>
    )
  }

  return (
    <ScrollView
      data={chatsQuery.result}
      renderItem={(chat) => <ChatTile chat={chat} />}
      onEndReached={pageNumber.increase}
    />
  )
}
