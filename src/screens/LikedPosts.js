import { useQuery } from "@tanstack/react-query"
import { useCounter } from "../utilities/hooks"
import { useAtom } from "jotai"
import { sessionAtom } from "../context"
import { requestServer } from '../utilities/requests'
import LoadingSpinner from "../components/LoadingSpinner"
import ScrollView from "../components/ScrollView"
import PostTile from "../components/PostTile"

const fetchLikedPosts = async (customerId, pageNumber) => {
    const payload = {
        customer_id: customerId,
        start: pageNumber * 20,
        amount: 20
    }
    const posts = await requestServer(
        "/posts_service/get_customer_liked_posts",
        payload
    )

    return posts
}

export default () => {
    const pageNumber = useCounter()
    const [session, _] = useAtom(sessionAtom)
    const likedPostsQuery = useQuery({
        queryKey: "likedPosts",
        queryFn: () => fetchLikedPosts(session.customerId, pageNumber.value)
    })

    if (likedPostsQuery.isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <ScrollView
            data={likedPostsQuery.data}
            keyExtractor={(post) => post.post_id}
            renderItem={(post) => <PostTile post={post} />}
            onEndReached={pageNumber.increment}
        />
    )
}