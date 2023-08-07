import 'react-native-gesture-handler'
import { useAtom } from 'jotai'
import { sessionAtom } from './src/context'
import { PaperProvider } from 'react-native-paper'
import { QueryClientProvider } from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { queryClient } from './src/context'
import Home from './src/screens/Home'
import DeliveryList from './src/screens/DeliveryList'
import ChatList from './src/screens/ChatList'
import Chat from './src/screens/Chat'
import Welcome from './src/screens/Welcome'
import SearchResults from './src/screens/SearchResults'
import AppSnackBar from './src/components/AppSnackBar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { View } from 'react-native'


const Stack = createStackNavigator()
const BottomTab = createMaterialBottomTabNavigator()

const NavigationComponent = () => {
  return (
    <View>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Chat"
          >
            {() => <Chat />}
          </Stack.Screen>

          <Stack.Screen
            name="SearchResults"
          >
            {() => <SearchResults />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>

      <NavigationContainer>
        <BottomTab.Navigator>
            <BottomTab.Screen
              name="Home"
            >
              {() => <Home />}
            </BottomTab.Screen>

            <BottomTab.Screen
              name="Deliveries"
            >
              {() => <DeliveryList />}
            </BottomTab.Screen>

            <BottomTab.Screen
              name="Chats"
            >
              {() => <ChatList />}
            </BottomTab.Screen>

            <BottomTab.Screen
              name="MyProfile"
            >
              {() => null}
            </BottomTab.Screen>
          </BottomTab.Navigator>
      </NavigationContainer>
    </View>
  )
}

const App = () => {
  const [session, _] = useAtom(sessionAtom)

  return (
    <QueryClientProvider queryClient={queryClient}>
      <PaperProvider>
        {
            session === null ?
            (
              <SafeAreaProvider>
                <Welcome/>
              </SafeAreaProvider>
            ) :
            <NavigationComponent />
        }
        <AppSnackBar />
      </PaperProvider>
    </QueryClientProvider>
   )
}

export default App;
