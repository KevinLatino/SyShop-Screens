import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import NumericInput from 'react-native-numeric-input'
import Picture from './Picture'
import { View, StyleSheet } from 'react-native'
import { Card, Text, Button } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    padding: 8
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

const createSaleIntent = async (postId, customerId, amount) => {
  const payload = {
    post_id: postId,
    customer_id: customerId,
    amount
  }
  const response = await requestServer(
    "/sales_service/create_sale_intent",
    payload
  )

  return response
}

const PostTile = ({ post }) => {
    return (
        <Card>
            <Card.Cover
                source={{ uri: post.multimedia[0] }}
            />

            <Card.Title
                title={post.title}
                subtitle={post.price}
            />

            <Card.Content>
                <Text variant="bodyMedium">
                    {post.description}
                </Text>
            </Card.Content>
        </Card>
    )
}

export default () => {
    const [amount, setAmount] = useState(1)
    const [session, _] = useAtom(sessionAtom)
    const navigation = useNavigation()
    const route = useRoute()

    const { postId } = route.params
    const postQuery = useQuery({
      queryKey: ["postToBuy"],
      queryFn: () => fetchPost(postId, session.customerId)
    })
    const createSaleIntentMutation = useMutation(
      (postId, customerId, amount) => createSaleIntent(postId, customerId, amount)
    )

    if (createSaleIntentMutation.isSuccess) {
      const stripeClientSecret = createSaleIntentMutation.data.stripe_client_secret

      navigation.navigate(
        "PaymentForm",
        {
          stripeClientSecret
        }
      )
    }

    if (postQuery.isLoading) {
        return (
          <LoadingSpinner />
        )
    }

    return (
        <View style={styles.container}>
            <PostTile post={postQuery.result} />

            <NumericInput
                minValue={1}
                maxValue={postQuery.result.amount}
                value={amount}
                onChange={setAmount}
            />

            <Button
                mode="outlined"
                onPress={
                  () => createSaleIntentMutation.mutate(postId, session.customerId, amount)
                }
            >
              {
                createSaleIntentMutation.isLoading ?
                <LoadingSpinner /> :
                "Comprar"
              }
            </Button>
        </View>
    )
}
