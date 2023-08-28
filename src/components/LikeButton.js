import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { IconButton } from 'react-native-paper'
import LoadingSpinner from './LoadingSpinner'
import { View } from 'react-native'

const likePost = async (postId, customerId) => {
  const payload = {
    customer_id: customerId,
    post_id: postId
  }
  const _ = await requestServer(
    "/posts_service/like_post",
    payload
  )
}

export default ({ postId, doesCustomerLikePost }) => {
  const [session, _] = useAtom(sessionAtom)
  const [isLiked, setIsLiked] = useState(doesCustomerLikePost)
  const likePostMutation = useMutation(
    ({ postId, customerId }) => likePost(postId, customerId)
  )

  const handleLike = () => {
    likePostMutation.mutate({ postId, customerId: session.customerId })

    setIsLiked(!isLiked)
  }

  return (
    <View>
      {
        likePostMutation.isLoading ?
        <LoadingSpinner /> :
        <IconButton
          mode="contained"
          icon={isLiked ? "heart" : "heart-outline"}
          onPress={handleLike}
        />
      }
    </View>
  )
}
