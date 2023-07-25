import { useState } from 'react'
import { useQuery } from '../utilities/requests'
import { useRoute } from '@react-navigation/native'

export default () => {
    const [amount, setAmount] = useState(1)
    const route = useRoute()

    const { postId } = route.params
}