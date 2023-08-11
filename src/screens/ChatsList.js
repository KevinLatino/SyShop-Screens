import { useQuery } from '@tanstack/react-query'
import { useCounter } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import ChatTile from '../components/ChatTile'
import LoadingSpinner from '../components/LoadingSpinner'

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
    "listOfChats",
    () => fetchChats(session.customerId, pageNumber.value)
  )

  if (chatsQuery.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <ScrollView
      data={chatsQuery.data}
      renderItem={(chat) => <ChatTile chat={chat} />}
      onEndReached={pageNumber.increment}
    />
  )
}
