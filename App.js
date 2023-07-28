import { PaperProvider } from 'react-native-paper'
import AppSnackBar from './src/components/AppSnackBar'

const App = () => {
  return (
    <PaperProvider>
      <AppSnackBar />
    </PaperProvider>
  )
}

export default App
