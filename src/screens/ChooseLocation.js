import { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { showMessage } from '../components/AppSnackBar'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationTile from '../components/LocationTile'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Button, FAB } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width
  },
  fab: {
    position: 'absolute',
    bottom: Dimensions.get("screen").height * 0.85,
    left: Dimensions.get("screen").width * 0.8
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

const createDelivery = async (saleId, locationId) => {
  const payload = {
    sale_id: saleId,
    location_id: locationId
  }
  const _ = await requestServer(
    "/deliveries_service/create_delivery",
    payload
  )
}

const LocationsScrollView = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [selectedLocation, setSelectedLocation] = useState()
  const [session, _] = useAtom(sessionAtom)
  const queryClient = useQueryClient()
  const locationsQuery = useQuery({
    queryKey: ["customerLocations"],
    queryFn: () => fetchLocations(session.customerId)
  })
  const createDeliveryMutation = useMutation(
    ({ saleId, locationId }) => createDelivery(saleId, locationId),
    {
      onSuccess: () => queryClient.refetchQueries({
        queryKey: ["activeDeliveries"]
      })
    }
  )
  const { saleId } = route.params

  const handleSelect = (location) => {
    setSelectedLocation(location)
  }

  const handleSubmit = () => {
    createDeliveryMutation.mutate({
      saleId,
      locationId: selectedLocation.location_id
    })
  }

  if (createDeliveryMutation.isSuccess) {
    showMessage("Tu entrega ahora está pendiente")

    navigation.navigate("Home")
  }

  if (locationsQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <View>
      <ScrollView
        data={locationsQuery.data}
        keyExtractor={(location) => location.location_id}
        renderItem={
          ({ item }) => {
            return (
              <LocationTile
                location={item}
                isSelected={item.location_id == selectedLocation.location_id}
                onPress={() => handleSelect(item)}
              />
            )
          }
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
    <SafeAreaView style={styles.container}>
      <LocationsScrollView />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={navigateToAddLocation}
      />
    </SafeAreaView>
  )
}
