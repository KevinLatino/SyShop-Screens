import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatCustomerName } from '../utilities/formatting'
import LoadingSpinner from '../components/LoadingSpinner'
import FloatingActionButton from '../components/FloatingActionButton'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Caption1 } from 'react-native-ios-kit'
import { Avatar, Text } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    backgroundColor: "white"
  },
  customerView: {
    flex: 1,
    alignItems: "center"
  },
  topContainer: {
    borderRadius: 30,
    height: "30%",
    width: "100%",
    backgroundColor: configuration.BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  extraInformationContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  informationEntry: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    padding: 5
  },
  fab: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.8,
    left: Dimensions.get("screen").width * 0.85
  }
})

const fetchCustomer = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const customer = await requestServer(
    "/customers_service/get_customer_by_id",
    payload
  )

  return customer
}

const InformationEntry = ({ icon, text }) => {
  return (
    <View style={styles.informationEntry}>
      <MaterialCommunityIcons
        name={icon}
        size={30}
        color="silver"
      />

      <Caption1 style={{ color: configuration.ACCENT_COLOR_1, flexShrink: 1 }}>
        {text}
      </Caption1>
    </View>
  )
}

const TopContainer = ({ picture, name }) => {
  return (
    <View style={styles.topContainer}>
      <Avatar.Image
        source={{ uri: formatBase64String(picture) }}
        size={80}
      />

      <Text
        variant="titleLarge"
        style={{ color: "white" }}
      >
        {name}
      </Text>
    </View>
  )
}

const ExtraInformationContainer = ({ phoneNumber }) => {
  return (
    <View style={styles.extraInformationContainer}>
      <InformationEntry
        icon="phone"
        text={phoneNumber}
      />
    </View>
  )
}

const CustomerView = () => {
  const [session, _] = useSession()

  const customerQuery = useQuery({
    queryKey: ["customer"],
    queryFn: () => fetchCustomer(session.data.customerId),
    disabled: session.isLoading
  })

  if (customerQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const {
    name,
    first_surname,
    second_surname,
    phone_number,
    picture
  } = customerQuery.data

  return (
    <View style={styles.customerView}>
      <TopContainer
        picture={picture}
        name={formatCustomerName(name, first_surname, second_surname)}
      />

      <ExtraInformationContainer
        phoneNumber={phone_number}
      />
    </View>
  )
}

export default () => {
  const navigation = useNavigation()

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  return (
    <View style={styles.container}>
      <CustomerView />

      <FloatingActionButton
        icon="pencil"
        onPress={navigateToEditProfile}
        style={styles.fab}
      />
    </View>
  )
}
