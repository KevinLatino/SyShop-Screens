import { useState } from 'react'
import { useAtom } from 'jotai'
import { useCounter } from '../hooks/useCounter'
import { sessionAtom } from '../context'
import { useNavigation, useRoute } from 'react-navigation'
import { useQuery, requestServer } from '../utilities/requests'
import { launchImageLibrary } from 'react-native-image-picker'
import { View, Image, StyleSheet } from 'react-native'
import { Surface, TouchableRipple, ActivityIndicator } from 'react-native-paper'
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
  imageMessageBubble: {
    borderRadius: 10,
    padding: 5
  }
})

const parseRawTextMessage = (rawTextMessage) => {
  return {
    text: rawTextMessage.content,
    createdAt: new Date(rawTextMessage.sent_datetime)
  }
}

const fetchMessages = async (chatId, pageNumber) => {
  const payload = {
    start: pageNumber * 20,
    amount: 20,
    chat_id: chatId
  }
  const messages = await requestServer(
    "/chat_service/get_chat_by_id",
    payload
  )

  return messages
}

const ImageMessageBubble = ({ image }) => {
  const navigation = useNavigation()

  const navigateToImageView = () => {
    navigation.navigate(
      "Chat.ImageView",
      {
        image
      }
    )
  }

  return (
    <TouchableRipple
      onPress={navigateToImageView}
    >
      <Surface
        elevation={5}
        style={styles.imageMessageBubble}
      >
        <Image
          source={{ uri: image, width: 50, height: 50 }}
        />
      </Surface>
    </TouchableRipple>
  )
}

const MessageBubble = ({ currentMessage, ...props }) => {
  switch (currentMessage.content_type) {
    case "text":
      return (
        <Bubble
          currentMessage={parseRawTextMessage(currentMessage)}
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#e00000',
            }
          }}
          textStyle={{
            right: {
              color: '#fff',
            }
          }}
        />
      )

    case "image":
      return (
        <ImageMessageBubble
          image={currentMessage.content}
        />
      )
  }
}

const SendTextMessageButton = ({ ...props }) => {
  return (
    <Send {...props}>
      <View>
        <MaterialCommunityIcons
          name="send-circle"
          style={{ marginBottom: 5, marginRight: 5 }}
          size={32}
          color="#e00000"
        />
      </View>
    </Send>
  )
}

const SendImageMessageButton = () => {
  return (
    <View>
      <MaterialCommunityIcons
        name="image"
        size={32}
        color="#e00000"
      />
    </View>
  )
}

const ScrollDownButton = () => {
  return (
    <FontAwesome
      name='angle-double-down'
      size={22}
      color='#333'
    />
  )
}

export const ImageView = () => {
  const route = useRoute()

  const { image } = route.params

  return (
    <View>
      <Image
        source={{ uri: image }}
      />
    </View>
  )
}

export default () => {
  const route = useRoute()
  const [messages, setMessages] = useState([])
  const [session, _] = useAtom(sessionAtom)
  const pageNumber = useCounter()

  const { chatId } = route.params
  const messagesQuery = useQuery(async () => {
    const fetchedMessages = await fetchMessages(chatId, pageNumber.value)
    const allMessages = GiftedChat.append(messages, fetchedMessages)

    setMessages(allMessages)
  })

  if (messagesQuery.result === null) {
    return (
      <View>
        <ActivityIndicator animating />
      </View>
    )
  }

  const handleTextMessageSend = (textMessage) => {
    // Esto es temporal, falta acomodar la navegación
    console.log("Se envía un texto")
  }

  const handleChoosePictureMessage = async () => {
    const chooseResponse = await launchImageLibrary({
      includeBase64: true,
      selectionLimit: 1
    })

    if (chooseResponse.didCancel || chooseResponse.errorCode !== null) {
      return
    }

    const [ image ] = chooseResponse.assets

    // Esto es temporal, falta acomodar la navegación
    console.log("Se envía una imagen: " + image.base64)
  }

  return (
    <GiftedChat
      placeholder='Mensaje...'
      renderBubble={(props) => <MessageBubble {...props} />}
      renderSend={(props) => <SendTextMessageButton {...props} />}
      renderActions={(props) => <SendImageMessageButton {...props} />}
      scrollToBottomComponent={<ScrollDownButton />}

      messages={messages}
      onSend={handleTextMessageSend}
      onLoadEarlier={pageNumber.increment}
      onPressActionButton={handleChoosePictureMessage}
      user={{
        user_id: session.user_id
      }}

      infiniteScroll
      loadEarlier={false}
      scrollToBottom
    />
  )
}
