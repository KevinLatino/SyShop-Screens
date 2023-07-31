import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { useQuery, requestServer } from '../utilities/requests'
import { View } from 'react-native'
import { List, ActivityIndicator } from 'react-native-paper'
import DeliveryTile from '../components/DeliveryTile'

const fetchActiveDeliveries = async (customerId) => {
  const payload = {
    customerId
  }
  const activeDeliveries = await requestServer(
    "/deliveries_service/get_customer_active_deliveries",
    payload
  )

  return activeDeliveries
}

const fetchInactiveDeliveries = async (customerId) => {
  const payload = {
    customerId
  }
  const inactiveDeliveries = await requestServer(
    "/deliveries_service/get_customer_inactive_deliveries",
    payload
  )

  return inactiveDeliveries
}

const DeliveriesListItems = ({ deliveries }) => {
  if (deliveries === null) {
    return (
      <View>
        <ActivityIndicator animating />
      </View>
    )
  }

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
  const activeDeliveriesQuery = useQuery(
    () => fetchActiveDeliveries(session.customerId)
  )
  const inactiveDeliveriesQuery = useQuery(
    () => fetchInactiveDeliveries(session.customerId)
  )

  return (
    <List.Section>
      <List.Subheader>
        Entregas activas
      </List.Subheader>

      <DeliveriesListItems deliveries={activeDeliveriesQuery.result} />

      <List.Subheader>
        Entregas inactivas
      </List.Subheader>

      <DeliveriesListItems deliveries={inactiveDeliveriesQuery.result} />
    </List.Section>
  )
}
