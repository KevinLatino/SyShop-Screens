import { View } from 'react-native'
import { CardField } from '@stripe/stripe-react-native'

export default () => {
    return (
        <View>
            <CardField
                cardStyle={{
                    backgroundColor: "#ffffff",
                    textColor: "#000000"
                }}
                onCardChange={(paymentInformation) => console.log(paymentInformation)}
            />
        </View>
    )
}