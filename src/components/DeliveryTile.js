import { showMessage } from '../components/AppSnackBar'
import { Linking } from 'react-native'
import { List, TouchableRipple } from 'react-native-paper'

const TrackLocationIcon = ({ delivery, ...props }) => {
  const uberTrackingUrl = delivery.uber_tracking_url

  const openLink = async () => {
    if (!(await Linking.canOpenURL(uberTrackingUrl))) {
      showMessage("Hubo un error intentando abrir el enlace de seguimiento de Uber")
    }

    await Linking.openURL(uberTrackingUrl)
  }

  return (
    <TouchableRipple
      onPress={openLink}
    >
      <List.Icon
        {...props}
        icon="map-marker"
      />
    </TouchableRipple>
  )
}

export default ({ delivery }) =>  {
  const title = delivery.post.title
  const amount = delivery.sale.amount
  const uber_state = delivery.uber_state
  const place_name = delivery.location.place_name

  return (
    <List.Item
      title={`${title} x${amount}`}
      description={`${place_name}: ${uber_state}`}
      left={(props) => <TrackLocationIcon {...props} delivery={delivery} />}
    />
  )
}
