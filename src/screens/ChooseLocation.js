import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { autocompleteAddress } from '../utilities/geoapify'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import { View, StyleSheet } from 'react-native'
import {
  TouchableRipple,
  List,
  FAB,
  Button,
  Searchbar,
  Portal,
  Modal,
  Surface
} from 'react-native-paper'

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

const formatLocationSubtitle = (location) => {
  const formatted
    = `${location.street_address}, ${location.city}, ${location.state}`

  return formatted
}

const addLocation = async (geoapifyAddress, customerId) => {
  const location = {
    place_name: geoapifyAddress.name,
    street_address: geoapifyAddress.address_line1,
    city: geoapifyAddress.city,
    state: geoapifyAddress.state ?? geoapifyAddress.province,
    zip_code: geoapifyAddress.postcode,
  }
  const payload = {
    customer_id: customerId,
    ...location
  }
  const _ = await requestServer(
    "/locations_service/add_customer_location",
    payload
  )
}

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

const LocationTile = ({ location }) => {
  return (
    <TouchableRipple>
      <List.Item
        title={location.place_name}
        description={formatLocationSubtitle(location)}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}

const AddressAutocompleteTile = ({ address, onSelect }) => {
  const isDisabled = address.name === undefined

  return (
    <TouchableRipple
      onPress={() => onSelect(address)}
      disabled={isDisabled}
      style={isDisabled ? { backgroundColor: "darkgray" } : {}}
    >
      <List.Item
        key={address.place_id}
        title={address.formatted}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}

const AddressAutocompleteInput = ({ onSelect }) => {
  const [searchedText, setSearchedText] = useState("")
  const addressesQuery = useQuery(
    "autocompletedAddresses",
    () => autocompleteAddress(searchedText)
  )

  return (
    <View>
      <Searchbar
        value={searchedText}
        onChangeText={setSearchedText}
        placeholder="Ubicación"
      />

      <View>
        <List.Section>
          {
            addressesQuery.isLoading ?
            <LoadingSpinner /> :
            addressesQuery.data.map((address) => {
              return (
                <AddressAutocompleteTile
                  key={address.place_id}
                  result={address}
                  onSelect={onSelect}
                />
              )
            })
          }
        </List.Section>
      </View>
    </View>
  )
}

const AddLocationModal = ({ visible, hideModal }) => {
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [session, _] = useAtom(sessionAtom)
  const addLocationMutation = useMutation(
    () => addLocation(selectedAddress, session.customerId)
  )

  if (addLocationMutation.isSuccess) {
    hideModal()
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal}>
        <Surface elevation={5}>
          <AddressAutocompleteInput onSelect={setSelectedAddress} />

          <Button
            mode="contained"
            onPress={addLocationMutation.mutate()}
            disabled={
              selectedAddress === null || addLocationMutation.isLoading
            }
          >
            {
              addLocationMutation.isLoading ?
              <LoadingSpinner /> :
              "Añadir domicilio"
            }
          </Button>
        </Surface>
      </Modal>
    </Portal>
  )
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [session, _] = useAtom(sessionAtom)
  const locationsQuery = useQuery(
    "customerLocations",
    () => fetchLocations(session.customerId)
  )

  return (
    <View style={styles.container}>
      {
        locationsQuery.isLoading ?
        <LoadingSpinner /> :
        <ScrollView
          data={locationsQuery.data}
          keyExtractor={(location) => location.location_id}
          renderItem={(location) => <LocationTile location={location} />}
          onStartReached={locationsQuery.refetch}
        />
      }

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
