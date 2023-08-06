import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationTile from '../components/LocationTile'
import { View, StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    height: "100vh",
    width: "100hh"
  },
  fab: {
    position: 'absolute',
    right: 10,
    bottom: 10
  }
})

const fetchLocations = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const locations = await requestServer(
    "/locations_service/get_customer_locations",
    payload
  )

  return locations
}

const LocationsScrollView = () => {
  const [session, _] = useAtom(sessionAtom)
  const locationsQuery = useQuery(
    "customerLocations",
    () => fetchLocations(session.customerId)
  )

  if (locationsQuery.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <ScrollView
      data={locationsQuery.data}
      keyExtractor={(location) => location.location_id}
      renderItem={(location) => <LocationTile location={location} />}
      onStartReached={locationsQuery.refetch}
    />
  )
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <View style={styles.container}>
      <LocationsScrollView />

      <AddLocationModal
        visible={isModalVisible}
        hideModal={() => setIsModalVisible(false)}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      />
    </View>
  )
}
