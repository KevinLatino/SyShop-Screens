import 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import { QueryClientProvider } from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { queryClient } from './src/context'
import Home from './src/screens/Home'
import DeliveryList from './src/screens/DeliveryList'
import ChatList from './src/screens/ChatList'
import AppSnackBar from './src/components/AppSnackBar'


const Stack = createStackNavigator()
const BottomTab = createMaterialBottomTabNavigator()

const App = () => {
  return (
    <QueryClientProvider queryClient={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Chat"
              component={<Chat />}
            />

            <Stack.Screen
              name="SearchResults"
              component={<SearchResults />}
            />
          </Stack.Navigator>

          <BottomTab.Navigator>
            <BottomTab.Screen
              name="Home"
              component={<Home />}
            />

            <BottomTab.Screen
              name="Deliveries"
              component={<DeliveryList />}
            />

            <BottomTab.Screen
              name="Chats"
              component={<ChatList />}
            />

            <BottomTab.Screen
              name="MyProfile"
            />
          </BottomTab.Navigator>
        </NavigationContainer>

        <AppSnackBar />
      </PaperProvider>
    </QueryClientProvider>
   )
}

export default App;
