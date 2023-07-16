import axios from 'axios'
import configuration from '../configuration'
import formatApiUrl from '../utilities/format-api-url'
import useAsync from '../hooks/useAsync'
import { useState } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import {
  TouchableRipple,
  List,
  FAB,
  Button,
  Searchbar,
  Portal,
  Modal
} from 'react-native-paper'

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 10,
    left: 5
  }
})

const formatLocationSubtitle = (location) => {
  const formatted
    = `${location.street_address}, ${location.city}, ${location.state}`

  return formatted
}

const getAddressAutocompleteResults = async (searchedText) => {
  const baseUrl = "https://api.geoapify.com/v1/geocode/autocomplete?"
  const queryParameters = new URLSearchParams()

  queryParameters.append("apiKey", configuration.GEOAPIFY_API_KEY)
  queryParameters.append("text", searchedText)
  queryParameters.append("lang", "es")
  queryParameters.append("filter", "countrycode:cr")
  queryParameters.append("format", "json")

  const url = baseUrl + queryParameters.toString()
  const searchResults = await axios.get(url)

  return searchResults
}

const storeLocation = async (geoapifyLocation) => {
  const location = {
    place_name: geoapifyLocation.name,
    street_address: geoapifyLocation.address_line1,
    city: geoapifyLocation.city,
    state: geoapifyLocation.state,
    zip_code: geoapifyLocation.postcode,
  }
  const url = formatApiUrl("/locations_service/add_customer_location")

  const { statusText } = await axios.post(url, {
    customer_id: null, // Temporal
    ...location,
  })

  if (statusText !== "OK") {
    throw Error("Could not store customer's new location")
  }
}

const getLocations = async () => {
  const url = formatApiUrl("/locations_service/get_customer_locations")

  const { data, statusText } = await axios.post(url, {
    customer_id: null // Temporal
  })

  if (statusText !== "OK") {
    throw Error("Could not get customer locations")
  }

  return data
}

const LocationTile = ({ location }) => {
  return (
    <TouchableRipple>
      <List.Item
        title={location.place_name}
        description={formatLocationSubtitle(location)}
        left={(props) => <List.Icon {...props} icon="location" />}
      />
    </TouchableRipple>
  )
}

const AddLocationFloatingActionButton = ({ onPress }) => {
  return (
    <FAB
      icon="plus"
      style={styles.fab}
      onPress={onPress}
    />
  )
}

const AddressAutocompleteInput = ({ onSelect }) => {
  const [searchedText, setSearchedText] = useState("")
  const [
    runGetAddressAutocompleteResults,
    addressAutocompleteResults,
    getAddressAutocompleteResultsError
  ] = useAsync(() => getAddressAutocompleteResults(searchedText))

  const resultTiles = addressAutocompleteResults.map((result) => {
    return (
      <TouchableRipple
        onPress={() => onSelect(result)}
      >
        <List.Item
          title={result.formatted}
          left={(props) => <List.Icon {...props} icon="location-pin" />}
        />
      </TouchableRipple>
    )
  })

  const handleSearch = (newSearchedText) => {
    runGetAddressAutocompleteResults()
    setSearchedText(newSearchedText)
  }

  return (
    <View>
      <Searchbar
        value={searchedText}
        onChangeText={handleSearch}
        placeholder="Escribe la ubicación de tu nuevo domicilio"
      />

      <View>
        <List.Section>
          {resultTiles}
        </List.Section>
      </View>
    </View>
  )
}

const AddLocationModal = ({ visible, hideModal }) => {
  const [selectedLocation, setSelectedLocation] = useState(null)

  const handlePress = async () => {
    try {
      await storeLocation(selectedLocation)
    } catch (error) {
      console.log(error)
    }

    hideModal()
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal}>
        <AddressAutocompleteInput onSelect={setSelectedLocation} />

        <Button
          onPress={handlePress}
        >
          Añadir domicilio
        </Button>
      </Modal>
    </Portal>
  )
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [
    runGetLocations,
    locations,
    getLocationsError
  ] = useAsync(() => getLocations())

  return (
    <View>
      <FlatList
        data={locations}
        keyExtractor={(location) => location.location_id}
        renderItem={(location) => <LocationTile location={location} />}
        onStartReached={runGetLocations}
      />

      <AddLocationModal
        visible={isModalVisible}
        hideModal={() => setIsModalVisible(false)}
      />

      <AddLocationFloatingActionButton
        onPress={() => setIsModalVisible(true)}
      />
    </View>
  )
}
