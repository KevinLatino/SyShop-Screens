import { PaperProvider } from 'react-native-paper'
import SearchBar from './src/components/SearchBar'

export default () => {
  return (
    <PaperProvider>
      <SearchBar />
    </PaperProvider>
  )
}
