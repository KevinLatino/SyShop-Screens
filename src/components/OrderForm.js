import { useState } from 'react'
import { useQuery, requestServer } from '../utilities/requests'
import { useRoute } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import NumericInput from 'react-native-numeric-input'
import { View, ActivityIndicator } from 'react-native'
import { Card, Text, Button } from 'react-native-paper'

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
    const route = useRoute()

    const { postId } = route.params
    const postQuery = useQuery(() => fetchPost(postId))

    const handlePurchase = async () => {
        const payload = {
            customer_id: session.customer_id,
            post_id: postId,
            amount: amount
        }
        const response = requestServer(
            "/sales_service/create_sale_intent",
            payload
        )
        const stripeClientSecret = response.stripe_client_secret

        // PENDIENTE: Seguir con la compra
        console.log(stripeClientSecret)
    }

    if (postQuery.result === null) {
        return (
            <View>
                <ActivityIndicator animating />
            </View>
        )
    }

    return (
        <View>
            <PostTile post={postQuery.result} />

            <NumericInput
                minValue={1}
                maxValue={postQuery.result.amount}
                value={amount}
                onChange={setAmount}
            />

            <Button
                mode="outlined"
                onPress={handlePurchase}
            >
                Comprar
            </Button>
        </View>
    )
}