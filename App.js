import { PaperProvider } from 'react-native-paper'
import SignUp from './src/pages/SignUp'
import SignIn from './src/pages/SignIn'
import ChooseLocation from './src/pages/ChooseLocation'

export default () => {
  return (
    <PaperProvider>
      <ChooseLocation />
    </PaperProvider>
  )
}
