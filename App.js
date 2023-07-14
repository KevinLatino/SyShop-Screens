import { PaperProvider } from 'react-native-paper'
import SignIn from './src/pages/SignIn'
import SignUp from './src/pages/SignUp'

export default () => {
  return (
    <PaperProvider>
      <SignUp />
    </PaperProvider>
  );
}
