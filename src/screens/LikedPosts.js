import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { sessionAtom } from "../context"
import { requestServer } from '../utilities/requests'
import LoadingSpinner from "../components/LoadingSpinner"
import ScrollView from "../components/ScrollView"
import PostTile from "../components/PostTile"
import { SafeAreaView } from "react-native-safe-area-context"

const fetchLikedPosts = async (customerId) => {
    const payload = {
        customer_id: customerId
    }
    const posts = await requestServer(
        "/posts_service/get_customer_liked_posts",
        payload
    )

    return posts
}

export default () => {
    const [session, _] = useAtom(sessionAtom)

    const likedPostsQuery = useQuery({
        queryKey: ["likedPosts"],
        queryFn: () => fetchLikedPosts(session.customerId)
    })

    if (likedPostsQuery.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    return (
      <SafeAreaView>
        <ScrollView
            data={likedPostsQuery.data}
            keyExtractor={(post) => post.post_id}
            renderItem={({ item }) => <PostTile post={item} />}
            emptyIcon="heart"
            emptyMessage="No te gusta ninguna publicación"
        />
      </SafeAreaView>
    )
}
