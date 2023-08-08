import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { useCounter } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import TextField from '../components/TextField'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import CommentTile from '../components/CommentTile'
import LikeButton from '../components/LikeButton'
import { ImageSlider } from 'react-native-image-slider-banner'
import { View, Text, Button, IconButton, Chip } from 'react-native'

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

const CommentInput = ({ postId, customerId }) => {
  const [text, setText] = useState("")
  const queryClient = useQueryClient()
  const addCommentMutation = useMutation(
    (postId, customerId, text) => addPostComment(postId, customerId, text)
  )

  const handleCommentSubmit = async () => {
    addCommentMutation.mutate(postId, customerId, text)

    await queryClient.refetchQueries({
      queryKey: "postComments"
    })
  }

  return (
    <View>
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
  const commentsQuery = useQuery(
    "postComments",
    () => fetchPostComments(postId, pageNumber.value)
  )

  if (commentsQuery.isLoading) {
    return (
      <LoadingSpinner />
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
        renderItem={(comment) => <CommentTile comment={comment} />}
        onEndReached={pageNumber.increment}
      />
    </View>
  )
}

const PostView = ({ post }) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false)

  const categoriesChips = post.categories.map((category) => {
    return (
      <Chip
        mode="flat"
        icon="shape"
      >
        {category}
      </Chip>
    )
  })

  return (
    <View>
      <ImageSlider
        data={post.multimedia}
        autoPlay={false}
      />

      <Text variant="bodySmall">
        {post.store_name} ({post.publication_date})
      </Text>

      <Text variant="bodyLarge">
        {post.title}
      </Text>

      <Text variant="bodySmall">
        {
          post.amount > 1 ?
          `${post.amount} unidades disponibles` :
          null
        }
      </Text>

      <Text variant="bodyMedium">
        {post.description}
      </Text>

      <View>
        <View>
          {categoriesChips}
        </View>

        <LikeButton />
      </View>

      <Button
        mode="contained"
        onPress={() => setIsBottomSheetVisible(true)}
      >
        Comprar (₡{post.price})
      </Button>
    </View>
  )
}

export default () => {
  const route = useRoute()
  const [session, _] = useAtom(sessionAtom)

  const { postId } = route.params
  const postQuery = useQuery(
    "post",
    () => fetchPost(postId, session.customerId)
  )

  return (
    <View>
      {
        postQuery.isLoading ?
        <LoadingSpinner /> :
        <PostView post={postQuery.data} />
      }

      <CommentsScrollView postId={postId} />
    </View>
  )
}
