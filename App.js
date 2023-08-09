import 'react-native-gesture-handler'
import { useAtom } from 'jotai'
import { sessionAtom } from './src/context'
import { PaperProvider } from 'react-native-paper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Home from './src/screens/Home'
import DeliveriesList from './src/screens/DeliveriesList'
import ChatsList from './src/screens/ChatsList'
import Chat from './src/screens/Chat'
import Welcome from './src/screens/Welcome'
import SignIn from './src/screens/SignIn'
import SignUp from './src/screens/SignUp'
import ChooseLocation from './src/screens/ChooseLocation'
import AddLocation from './src/screens/AddLocation'
import SearchResults from './src/screens/SearchResults'
import PostView from './src/screens/PostView'
import EditProfile from './src/screens/EditProfile'
import LikedPosts from './src/screens/LikedPosts'
import PurchasesList from './src/screens/PurchasesList'
import ProfileView from './src/screens/ProfileView'
import AppSnackBar from './src/components/AppSnackBar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const queryClient = new QueryClient()
const Stack = createStackNavigator()
const BottomTab = createMaterialBottomTabNavigator()

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Home"
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: "home-variant"
        }}
      >
        {() => <Home />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="Deliveries"
        options={{
          tabBarLabel: "Entregas",
          tabBarIcon: "moped"
        }}
      >
        {() => <DeliveryList />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="Chats"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: "chat"
        }}
      >
        {() => <ChatList />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="MyProfile"
        options={{
          tabBarLabel: "Mi Perfil",
          tabBarIcon: "account"
        }}
      >
        {() => null}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  )
}

const StackNavigator = () => {
  const [session, _] = useAtom(sessionAtom)

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={session === null ? "Welcome" : "Home"}
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
            name="BottomTabNavigator"
          >
            {() => <BottomTabNavigator />}
          </Stack.Screen>

          <Stack.Screen
            name="Welcome"
          >
            {() => <Welcome />}
          </Stack.Screen>

          <Stack.Screen
            name="SignIn"
          >
            {() => <SignIn />}
          </Stack.Screen>

          <Stack.Screen
            name="SignUp"
          >
            {() => <SignUp />}
          </Stack.Screen>

          <Stack.Screen
            name="Home"
          >
            {() => <Home />}
          </Stack.Screen>

          <Stack.Screen
            name="DeliveriesList"
          >
            {() => <DeliveriesList />}
          </Stack.Screen>

          <Stack.Screen
            name="ChatsList"
          >
            {() => <ChatsList />}
          </Stack.Screen>

          <Stack.Screen
            name="MyProfile"
          >
            {() => null}
          </Stack.Screen>

          <Stack.Screen
            name="Chat"
          >
            {() => <Chat />}
          </Stack.Screen>

          <Stack.Screen
            name="ChooseLocation"
          >
            {() => <ChooseLocation />}
          </Stack.Screen>

          <Stack.Screen
            name="AddLocation"
          >
            {() => <AddLocation />}
          </Stack.Screen>

          <Stack.Screen
            name="SearchResults"
          >
            {() => <SearchResults />}
          </Stack.Screen>

          <Stack.Screen
            name="PostView"
          >
            {() => <PostView />}
          </Stack.Screen>

          <Stack.Screen
            name="EditProfile"
          >
            {() => <EditProfile />}
          </Stack.Screen>

          <Stack.Screen
            name="LikedPosts"
          >
            {() => <LikedPosts />}
          </Stack.Screen>

          <Stack.Screen
            name="PurchasesList"
          >
            {() => <PurchasesList />}
          </Stack.Screen>

          <Stack.Screen
            name="ProfileView"
          >
            {() => <ProfileView />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <StackNavigator />

        <AppSnackBar />
      </PaperProvider>
    </QueryClientProvider>
   )
}

export default App;
