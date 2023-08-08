import { useQuery } from '@tanstack/react-query'
import { useCounter } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import SaleTile from '../components/SaleTile'

const fetchPurchases = async (customerId, pageNumber) => {
    const payload = {
        customer_id: customerId,
        start: pageNumber * 20,
        amount: 20
    }
    const purchases = await requestServer(
        "/sales_service/get_customer_purchases",
        payload
    )

    return purchases
}

export default () => {
    const pageNumber = useCounter()
    const [session, _] = useAtom(sessionAtom)
    const purchasesQuery = useQuery({
        queryKey: "customerPurchases",
        queryFn: () => fetchPurchases(session.customerId, pageNumber.value)
    })

    if (purchasesQuery.isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <ScrollView
            data={purchasesQuery.data}
            keyExtractor={(purchase) => purchase.sale_id}
            renderItem={(purchase) => <SaleTile purchase={purchase} />}
            onEndReached={pageNumber.increment}
        />
    )
}