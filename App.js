import 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import { NavigationContainer } from 'react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import AppSnackBar from './src/components/AppSnackBar'
import Home from './src/pages/Home'

const Stack = createStackNavigator()
const BottomTab = createMaterialBottomTabNavigator()

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
        </Stack.Navigator>

        <BottomTab.Navigator>
          <BottomTab.Screen
            name="Inicio"
            component={<Home />}
          />
      
          <BottomTab.Screen
            name="Entregas"
            component={}
          />

          <BottomTab.Screen
            name="Mensajes"
            component={}
          />

          <BottomTab.Screen
            name="Mi perfil"
            component={}
          />
        </BottomTab.Navigator>
      </NavigationContainer>

      <AppSnackBar />
    </PaperProvider>
  )
}

export default App
