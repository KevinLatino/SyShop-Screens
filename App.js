import 'react-native-gesture-handler'
import { useAtom } from 'jotai'
import { sessionAtom } from './src/context'
import { PaperProvider } from 'react-native-paper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
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
import StoreView from './src/screens/StoreView'
import AppSnackBar from './src/components/AppSnackBar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const queryClient = new QueryClient()
const Stack = createStackNavigator()
const BottomTab = createMaterialBottomTabNavigator()
const ProfileViewDrawer = createDrawerNavigator()

const ProfileViewDrawerNavigator = () =>  {
  return (
    <ProfileViewDrawer.Navigator open initialRouteName="ProfileView">
      <ProfileViewDrawer.Screen
        name="ProfileView"
      >
        {() => <ProfileView />}
      </ProfileViewDrawer.Screen>

      <ProfileViewDrawer.Screen
        name="LikedPosts"
      >
        {() => <LikedPosts />}
      </ProfileViewDrawer.Screen>

      <ProfileViewDrawer.Screen
        name="PurchasesList"
      >
        {() => <PurchasesList />}
      </ProfileViewDrawer.Screen>
    </ProfileViewDrawer.Navigator>
  )
}

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
        name="DeliveriesList"
        options={{
          tabBarLabel: "Entregas",
          tabBarIcon: "moped"
        }}
      >
        {() => <DeliveriesList />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="ChatsList"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: "chat"
        }}
      >
        {() => <ChatsList />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="ProfileView"
        options={{
          tabBarLabel: "Mi Perfil",
          tabBarIcon: "account"
        }}
      >
        {() => <ProfileViewDrawerNavigator />}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  )
}

const App = () => {
  const [session, _] = useAtom(sessionAtom)

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={(session === null) ? "Welcome" : "Home"}
              screenOptions={{
                headerShown: false
              }}
            >
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
                {() => <BottomTabNavigator />}
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

              <Stack.Screen
                name="StoreView"
              >
                {() => <StoreView />}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>

        <AppSnackBar />
      </PaperProvider>
    </QueryClientProvider>
  )
}

export default App;
