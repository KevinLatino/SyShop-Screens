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
import Screen from '../components/Screen'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Button, FAB } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width
  },
  fab: {
    position: 'absolute',
    top: Dimensions.get("screen").height * 0.85,
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

const LocationsScrollView = ({ saleId }) => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useAtom(sessionAtom)

  const [selectedLocation, setSelectedLocation] = useState(null)

  const handleSelect = (location) => {
    setSelectedLocation(location)
  }

  const handleSubmit = () => {
    createDeliveryMutation.mutate({
      saleId,
      locationId: selectedLocation.location_id
    })
  }

  const handleSuccess = (_) => {
    queryClient.refetchQueries({ queryKey: ["activeDeliveries"] })

    showMessage("Tu entrega ahora está pendiente")

    navigation.goBack()
  }

  const locationsQuery = useQuery({
    queryKey: ["customerLocations"],
    queryFn: () => fetchLocations(session.customerId)
  })
  const createDeliveryMutation = useMutation(
    ({ saleId, locationId }) => createDelivery(saleId, locationId),
    {
      onSuccess: handleSuccess
    }
  )

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
                isSelected={
                  (selectedLocation !== null) &&
                  (item.location_id == selectedLocation.location_id)
                }
                onPress={() => handleSelect(item)}
              />
            )
          }
        }
      />

      <Button
        mode="contained"
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
  const route = useRoute()

  const { saleId } = route.params

  const navigateToAddLocation = () => {
    navigation.navigate("AddLocation")
  }

  return (
    <Screen>
      <LocationsScrollView saleId={saleId} />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={navigateToAddLocation}
      />
    </Screen>
  )
}
