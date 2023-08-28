import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useQuery, useMutation } from '@tanstack/react-query'
import { autocompleteAddress } from '../utilities/geoapify'
import { requestServer } from '../utilities/requests'
import SearchInput from '../components/SearchInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { TouchableRipple, List } from 'react-native-paper'

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
  const addressesQuery = useQuery({
    queryKey: ["autocompletedAddresses"],
    queryFn: () => autocompleteAddress(searchedText)
  })

  return (
    <View>
      <SearchInput
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

export default () => {
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [session, _] = useAtom(sessionAtom)
  const navigation = useNavigation()
  const addLocationMutation = useMutation(
    ({ selectedAddress, customerId }) => addLocation(selectedAddress, customerId)
  )

  const handleAdd = () => {
    addLocationMutation.mutate({
      selectedAddress,
      customerId: session.customerId
    })
  }

  if (addLocationMutation.isSuccess) {
    navigation.navigate("ChooseLocation")
  }

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
