import { PaperProvider } from 'react-native-paper'
import { StripeProvider } from '@stripe/stripe-react-native'
import SignUp from './src/pages/SignUp'
import SignIn from './src/pages/SignIn'
import ChooseLocation from './src/pages/ChooseLocation'
import configuration from './src/configuration'
import PaymentForm from './src/components/PaymentForm'

export default () => {
  return (
    <StripeProvider
        publishableKey={configuration.publishableKey}
    >
          <PaperProvider>
            <PaymentForm />
          </PaperProvider>
    </StripeProvider>
  )
}
