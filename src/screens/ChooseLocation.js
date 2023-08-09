import { useNavigation } from '@react-navigation/native'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { showMessage } from '../components/AppSnackBar'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationTile from '../components/LocationTile'
import { View, StyleSheet } from 'react-native'
import { Button, FAB } from 'react-native-paper'

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
  const navigation = useNavigation()
  const [session, _] = useAtom(sessionAtom)
  const locationsQuery = useQuery(
    "customerLocations",
    () => fetchLocations(session.customerId)
  )
  const createDeliveryMutation = useMutation(
    () => createDelivery()
  )

  const handleSelect = (location) => {
    navigation.navigate("Home")
  }

  if (createDeliveryMutation.isSuccess) {
    showMessage("Tu entrega ahora está pendiente")

    navigation.navigate("Home")
  }

  if (locationsQuery.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <View>
      <ScrollView
        data={locationsQuery.data}
        keyExtractor={(location) => location.location_id}
        renderItem={
          (location) => <LocationTile location={location} onPress={() => handleSelect(location)} />
        }
        onStartReached={locationsQuery.refetch}
      />

      <Button
        onPress={handleSubmit}
      >
        {
          createDeliveryMutation.isLoading ?
          <LoadingSpinner /> :
          "Programar entrega"
        }
      </Button>
    </View>
  )
}

export default () => {
  const navigation = useNavigation()

  const navigateToAddLocation = () => {
    navigation.navigate("AddLocation")
  }

  return (
    <View style={styles.container}>
      <LocationsScrollView />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={navigateToAddLocation}
      />
    </View>
  )
}
