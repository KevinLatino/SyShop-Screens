import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer, useQuery } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import { View } from 'react-native'

const fetchChats = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const chats = await requestServer("/chat_service/get_user_chats", payload)

  return chats
}

export default () => {
  const [session, _] = useAtom(sessionAtom)
  const chatsQuery = useQuery(() => fetchChats(session.customerId))

  return (
    <View>
      {
        chatsQuery.result !== null
        ? <ScrollView
          data={chatsQuery.result}
          renderItem={(chat) => <ChatTile chat={chat} />}
        />
        : null
      }
    </View>
  )
}
