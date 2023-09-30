import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '../context'
import { autocompleteAddress } from '../utilities/geoapify'
import { requestServer } from '../utilities/requests'
import SearchInput from '../components/SearchInput'
import LoadingSpinner from '../components/LoadingSpinner'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { Button, TouchableRipple, List } from 'react-native-paper'

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

  const handleSearch = () => {
    getAddressesMutation.mutate({ searchedText })
  }

  const getAddressesMutation = useMutation(
    ({ searchedText }) => autocompleteAddress(searchedText)
  )

  if (getAddressesMutation.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  const tiles = !getAddressesMutation.data
      ? null
      : (
        getAddressesMutation.data.map((address) => {
          return (
            <AddressAutocompleteTile
              key={address.place_id}
              address={address}
              onSelect={onSelect}
            />
          )
        })
      )

  return (
    <View>
      <SearchInput
        value={searchedText}
        onChangeText={setSearchedText}
        onSubmitEditing={handleSearch}
        placeholder="Ubicación"
      />

      <View>
        <List.Section>
          {tiles}
        </List.Section>
      </View>
    </View>
  )
}

export default () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [selectedAddress, setSelectedAddress] = useState(null)

  const handleAdd = () => {
    addLocationMutation.mutate({
      selectedAddress,
      customerId: session.data.customerId
    })
  }

  const handleSuccess = (_) => {
    queryClient.refetchQueries({
      queryKey: ["customerLocations"]
    })

    navigation.goBack()
  }

  const addLocationMutation = useMutation(
    ({ selectedAddress, customerId }) => addLocation(selectedAddress, customerId),
    {
      onSuccess: handleSuccess
    }
  )

  return (
    <SafeAreaView>
      <AddressAutocompleteInput onSelect={setSelectedAddress} />

      <Button
        mode="contained"
        onPress={handleAdd}
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
    </SafeAreaView>
  )
}
