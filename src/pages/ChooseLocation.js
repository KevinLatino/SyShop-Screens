import axios from 'axios'
import configuration from '../configuration'
import formatApiUrl from '../utilities/format-api-url'
import useAsync from '../hooks/useAsync'
import { useState } from 'react'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { FlatList, View, StyleSheet } from 'react-native'
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
  },
  disabledAddressAutocompleteResultTile: {
    backgroundColor: "darkgray"
  }
})

const formatLocationSubtitle = (location) => {
  const formatted
    = `${location.street_address}, ${location.city}, ${location.state}`

  return formatted
}

const getAddressAutocompleteResults = async (searchedText) => {
  if (searchedText === "") {
    return null
  }

  const baseUrl = "https://api.geoapify.com/v1/geocode/autocomplete?"
  const queryParameters = new URLSearchParams()

  queryParameters.append("apiKey", configuration.GEOAPIFY_API_KEY)
  queryParameters.append("text", searchedText)
  queryParameters.append("lang", "es")
  queryParameters.append("filter", "countrycode:cr")
  queryParameters.append("format", "json")

  const url = baseUrl + queryParameters.toString()
  const { data } = await axios.get(url)
  const searchResults = data.results

  return searchResults
}

const storeLocation = async (geoapifyLocation, session) => {
  const location = {
    place_name: geoapifyLocation.name,
    street_address: geoapifyLocation.address_line1,
    city: geoapifyLocation.city,
    state: geoapifyLocation.state ?? geoapifyLocation.province,
    zip_code: geoapifyLocation.postcode,
  }
  const url = formatApiUrl("/locations_service/add_customer_location")

  const { statusText } = await axios.post(url, {
    customer_id: session.customerId,
    ...location,
  })

  if (statusText !== "OK") {
    throw Error("Could not store customer's new location")
  }
}

const getLocations = async (session) => {
  const url = formatApiUrl("/locations_service/get_customer_locations")

  const { data, statusText } = await axios.post(url, {
    customer_id: session.customerId
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
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}

const AddressAutocompleteResultTile = ({ result, onSelect }) => {
  const isDisabled = result.name === undefined

  return (
    <TouchableRipple
      onPress={() => onSelect(result)}
      disabled={isDisabled}
      style={isDisabled ? styles.disabledAddressAutocompleteResultTile : {}}
    >
      <List.Item
        key={result.place_id}
        title={result.formatted}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
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

  const resultTiles = (addressAutocompleteResults !== null)
    ? addressAutocompleteResults.map(
      (result) => {
        return (
          <AddressAutocompleteResultTile
            key={result.place_id}
            result={result}
            onSelect={onSelect}
          />
        )
      }
    )
    : null

  const handleSearch = (newSearchedText) => {
    runGetAddressAutocompleteResults()
    setSearchedText(newSearchedText)
  }

  return (
    <View>
      <Searchbar
        value={searchedText}
        onChangeText={handleSearch}
        placeholder="Ubicación"
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
  const [session, _] = useAtom(sessionAtom)
  console.log(selectedLocation)

  const handlePress = async () => {
    try {
      await storeLocation(selectedLocation, session)
    } catch (error) {
      console.log(error)
    }

    hideModal()
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal}>
        <Surface elevation={5}>
          <AddressAutocompleteInput onSelect={setSelectedLocation} />

          <Button
            mode="contained"
            onPress={handlePress}
            disabled={selectedLocation === null}
          >
            Añadir domicilio
          </Button>
        </Surface>
      </Modal>
    </Portal>
  )
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [session, _] = useAtom(sessionAtom)
  const [
    runGetLocations,
    locations,
    getLocationsError
  ] = useAsync(() => getLocations(session))

  return (
    <View style={styles.container}>
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
