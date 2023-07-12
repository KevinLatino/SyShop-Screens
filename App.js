import { PaperProvider } from 'react-native-paper'
import GoogleSignInButton from './src/components/GoogleSignInButton'

const App = () => {
  return (
    <GoogleSignInButton setUserInformation={(u) => console.log(u)} />
  )
}

export default () => {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}
