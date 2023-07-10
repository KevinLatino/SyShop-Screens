import { PaperProvider } from 'react-native-paper'
import SignIn from './src/pages/SignIn.js'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure();

export default () => {
  return (
    <PaperProvider>
      <SignIn />
    </PaperProvider>
  );
}
