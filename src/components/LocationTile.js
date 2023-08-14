import { TouchableRipple, List } from "react-native-paper"

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
      {
        // Temporal, hay que aplicar estilos
        isSelected ?? "Seleccionado"
      }

      <List.Item
        title={location.place_name}
        description={formatLocationSubtitle(location)}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}
