import { PaperProvider } from 'react-native-paper'
import SignIn from './src/pages/SignIn'

export default () => {
  return (
    <PaperProvider>
      <SignIn />
    </PaperProvider>
  );
}
