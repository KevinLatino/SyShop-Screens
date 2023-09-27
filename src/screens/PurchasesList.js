import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import SaleTile from '../components/SaleTile'
import Screen from '../components/Screen'

const fetchPurchases = async (customerId) => {
    const payload = {
        customer_id: customerId
    }
    const purchases = await requestServer(
        "/sales_service/get_customer_purchases",
        payload
    )

    return purchases
}

export default () => {
    const [session, _] = useAtom(sessionAtom)

    const purchasesQuery = useQuery({
        queryKey: ["customerPurchases"],
        queryFn: () => fetchPurchases(session.customerId)
    })

    if (purchasesQuery.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    return (
      <Screen>
        <ScrollView
            data={purchasesQuery.data}
            keyExtractor={(purchase) => purchase.sale_id}
            renderItem={({ item }) => <SaleTile sale={item} />}
        />
      </Screen>
    )
}
