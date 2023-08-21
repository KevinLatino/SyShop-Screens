import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { View } from 'react-native'
import { List, Text } from 'react-native-paper'
import DeliveryTile from '../components/DeliveryTile'
import LoadingSpinner from '../components/LoadingSpinner'

const fetchActiveDeliveries = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const activeDeliveries = await requestServer(
    "/deliveries_service/get_customer_active_deliveries",
    payload
  )

  return activeDeliveries
}

const fetchInactiveDeliveries = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const inactiveDeliveries = await requestServer(
    "/deliveries_service/get_customer_inactive_deliveries",
    payload
  )

  return inactiveDeliveries
}

const DeliveriesListItems = ({ deliveries }) => {
  const deliviriesListItems = deliveries.map((delivery) => {
    return (
      <DeliveryTile
        key={delivery.delivery_id}
        delivery={delivery}
      />
    )
  })

  return (
    <View>
      {deliviriesListItems}
    </View>
  )
}

export default () => {
  const [session, _] = useAtom(sessionAtom)
  const activeDeliveriesQuery = useQuery({
    queryKey: ["activeDeliveries"],
    queryFn: () => fetchActiveDeliveries(session.customerId)
  })
  const inactiveDeliveriesQuery = useQuery({
    queryKey: ["inactiveDeliveries"],
    queryFn: () => fetchInactiveDeliveries(session.customerId)
  })

  return (
    <View>
      <Text variant="titleLarge">
        Entregas que esperas
      </Text>

      <List.Section>
        <List.Subheader>
          Entregas activas
        </List.Subheader>

        {
          activeDeliveriesQuery.isLoading ?
          <LoadingSpinner /> :
          <DeliveriesListItems deliveries={activeDeliveriesQuery.data} />
        }

        <List.Subheader>
          Entregas inactivas
        </List.Subheader>

        {
          inactiveDeliveriesQuery.isLoading ?
          <LoadingSpinner /> :
          <DeliveriesListItems deliveries={inactiveDeliveriesQuery.data} />
        }
      </List.Section>
    </View>
  )
}
