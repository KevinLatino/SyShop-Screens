import axios from 'axios'
import configuration from '../configuration'
import useAsync from '../hooks/useAsync'
import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  TouchableRipple,
  List,
  FAB,
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

const AddLocationModel = ({ visible, onDismiss }) => {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
      </Modal>
    </Portal>
  )
}
