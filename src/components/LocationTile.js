import { TouchableRipple, List } from "react-native-paper"

const formatLocationSubtitle = (location) => {
  const formatted
    = `${location.street_address}, ${location.city}, ${location.state}`

  return formatted
}

export default ({ location, onPress }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <List.Item
        title={location.place_name}
        description={formatLocationSubtitle(location)}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}
