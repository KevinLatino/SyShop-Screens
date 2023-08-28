import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useCounter } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import TextField from '../components/TextField'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import CommentTile from '../components/CommentTile'
import LikeButton from '../components/LikeButton'
import OrderForm from '../components/OrderForm'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ImageSlider } from 'react-native-image-slider-banner'
import { BottomSheet } from 'react-native-btr'
import {
  View,
  StyleSheet,
  ScrollView as ReactNativeScrollView
} from 'react-native'
import {
  Text,
  Divider,
  Button,
  IconButton,
  Chip,
  TouchableRipple
} from 'react-native-paper'

const styles = StyleSheet.create({
  informationView: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    gap: 16,
    padding: 16
  },
  informationActionsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  categoriesChipsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  buyButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    padding: 8
  },
  commentInputView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 16,
    width: "100%",
  }
})

const fetchPost = async (postId, customerId) => {
  const payload = {
    post_id: postId,
    customer_id: customerId
  }
  const post = await requestServer(
    "/posts_service/get_post_by_id",
    payload
  )

  return post
}

const fetchPostComments = async (postId, pageNumber) => {
  const payload = {
    post_id: postId,
    start: pageNumber * 20,
    amount: 20
  }
  const comments = await requestServer(
    "/comments_service/get_post_comments",
    payload
  )

  return comments
}

const addPostComment = async (postId, customerId, text) => {
  const payload = {
    post_id: postId,
    customer_id: customerId,
    text
  }
  const _ = await requestServer(
    "/comments_service/add_comment",
    payload
  )
}

const formatPublicationDate = (isoDateString) => {
  const date = new Date(isoDateString)

  const day = date.getDay() + 1
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const formatted = `${day} de ${month} ${year} a las ${hours}:${minutes}`

  return formatted
}

const CommentInput = ({ postId, customerId }) => {
  const [text, setText] = useState("")
  const queryClient = useQueryClient()
  const addCommentMutation = useMutation(
    ({ postId, customerId, text }) => addPostComment(postId, customerId, text)
  )

  const handleCommentSubmit = async () => {
    addCommentMutation.mutate({
      postId,
      customerId,
      text
    })

    await queryClient.refetchQueries({
      queryKey: ["postComments"]
    })
  }

  return (
    <View style={styles.commentInputView}>
      <TextField
        value={text}
        onChangeText={setText}
        multiline
        numberOflines={4}
        placeholder="Escribe un comentario"
      />

      <IconButton
        icon="send"
        mode="contained"
        disabled={text === ""}
        onPress={handleCommentSubmit}
      />
    </View>
  )
}

const CommentsScrollView = ({ postId }) => {
  const [session, _] = useAtom(sessionAtom)
  const pageNumber = useCounter()
  const commentsQuery = useQuery({
    queryKey: ["postComments"],
    queryFn: () => fetchPostComments(postId, pageNumber.value)
  })

  if (commentsQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <View>
      <CommentInput
        customerId={session.customerId}
        postId={postId}
      />

      <ScrollView
        data={commentsQuery.data}
        keyExtractor={(comment) => comment.comment_id}
        renderItem={({ item }) => <CommentTile comment={item} />}
        onEndReached={pageNumber.increment}
      />
    </View>
  )
}

const PostView = ({ post }) => {
  const navigation = useNavigation()
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false)

  const categoriesChips = post.categories.map((category) => {
    return (
      <Chip
        key={category}
        mode="flat"
        icon="shape"
      >
        {category}
      </Chip>
    )
  })

  const navigateToStoreView = () => {
    navigation.navigate("StoreView", {
      storeId: post.store_id
    })
  }

  return (
    <View>
      <ImageSlider
        data={post.multimedia}
        autoPlay={false}
      />

      <View style={styles.informationView}>
        <TouchableRipple
          onPress={navigateToStoreView}
        >
          <Text
            variant="titleMedium"
            style={{ color: "red" }}
          >
            {post.store_name}
          </Text>
        </TouchableRipple>

        <Text variant="titleLarge">
          {post.title}
        </Text>

        <Text variant="bodyMedium">
          {formatPublicationDate(post.publication_date)}
        </Text>

        <Text variant="bodyLarge">
          {
            post.amount > 1 ?
            `${post.amount} unidades disponibles` :
            "Solo una unidad disponible"
          }
        </Text>

        <Text variant="bodyLarge">
          {post.description}
        </Text>

        <View style={styles.informationActionsView}>
          <View style={styles.categoriesChipsView}>
            {categoriesChips}
          </View>

          <LikeButton />
        </View>

        <View style={styles.buyButtonWrapper}>
          <Button
            mode="contained"
            onPress={() => setIsBottomSheetVisible(true)}
            style={{ width: "100%" }}
          >
            Comprar (₡{post.price})
          </Button>
        </View>
      </View>

      <BottomSheet
        visible={isBottomSheetVisible}
        onBackButtonPress={() => setIsBottomSheetVisible(false)}
        onBackdropPress={() => setIsBottomSheetVisible(false)}
      >
        <OrderForm />
      </BottomSheet>
    </View>
  )
}

export default () => {
  const route = useRoute()
  const [session, _] = useAtom(sessionAtom)

  const { postId } = route.params
  const postQuery = useQuery({
    queryKey: ["post"],
    queryFn: () => fetchPost(postId, session.customerId)
  })

  return (
    <ReactNativeScrollView>
      <SafeAreaView>
        {
          postQuery.isLoading ?
          <LoadingSpinner inScreen /> :
          <PostView post={postQuery.data} />
        }

        <Divider />

        <CommentsScrollView postId={postId} />
      </SafeAreaView>
    </ReactNativeScrollView>
  )
}
