import { StyleSheet } from 'react-native'
import { TouchableRipple, List } from "react-native-paper"

const styles = StyleSheet.create({
  locationTileSelected: {
    backgroundColor: "darkgray"
  }
})

const formatLocationSubtitle = (location) => {
  const formatted
    = `${location.street_address}, ${location.city}, ${location.state}`

  return formatted
}

export default ({ location, isSelected, onPress }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <List.Item
        style={isSelected ? styles.locationTileSelected : null}
        title={location.place_name}
        description={formatLocationSubtitle(location)}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}
