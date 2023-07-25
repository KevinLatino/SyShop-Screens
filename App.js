import { PaperProvider } from 'react-native-paper'
import SearchBar from './src/components/SearchBar'
import TextField from './src/components/TextField'
import SignIn from './src/pages/SignIn'

export default () => {
  return (
    <PaperProvider>
	  <SignIn />
    </PaperProvider>
  )
}
