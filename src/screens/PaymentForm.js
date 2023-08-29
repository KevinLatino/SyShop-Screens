import { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { showMessage } from '../components/AppSnackBar'
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native'
import LoadingSpinner from '../components/LoadingSpinner'
import { View, Dimensions } from 'react-native'
import { Button } from 'react-native-paper'

const styles = {
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    padding: 8,
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000'
  },
  cardField: {
    height: 50,
    marginVertical: 30
  }
}

export default () => {
  const route = useRoute()
  const [cardDetails, setCardDetails] = useState(null)
  const stripePaymentConfirmer = useConfirmPayment()

  const { stripeClientSecret } = route.params
  const cardPlaceholders = {
    number: '4242 4242 4242 4242',
  }

  const handlePay = async () => {
    const response = await stripePaymentConfirmer.confirmPayment(
      stripeClientSecret,
      {
        paymentMethodType: "Card"
      }
    )

    if (response.error !== null) {
      showMessage("No se pudo procesar tu pago, inténtalo más tarde")
    }
  }

  const disabled =
    (stripePaymentConfirmer.loading) ||
    (cardDetails === null) ||
    (!cardDetails.complete)

  return (
    <View style={styles.container}>
      <CardField
        postalCodeEnabled={true}
        placeholders={cardPlaceholders}
        cardStyle={styles.cardStyle}
        style={styles.cardField}
        onCardChange={setCardDetails}
      />

      <Button
        onPress={handlePay}
        disabled={disabled}
      >
        {
          stripePaymentConfirmer.loading ?
          <LoadingSpinner /> :
          "Pagar"
        }
      </Button>
    </View>
  )
}
