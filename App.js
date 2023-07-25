import { PaperProvider } from 'react-native-paper'
import SearchBar from './src/components/SearchBar'
import TextField from './src/components/TextField'

export default () => {
  return (
    <PaperProvider>
      <TextField placeholder="pene" />
    </PaperProvider>
  )
}
