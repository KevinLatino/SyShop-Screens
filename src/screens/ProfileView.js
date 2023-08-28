import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String } from '../utilities/formatting'
import LoadingSpinner from '../components/LoadingSpinner'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, Dimensions } from 'react-native'
import {
    Text,
    Avatar,
    IconButton,
    FAB
} from 'react-native-paper'

const styles = StyleSheet.create({
    profileView: {
      justifyContent: "space-between",
      alignItems: "center",
      gap: 32,
      padding: 32
    },
    profileViewData: {
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 16,
      padding: 8
    },
    informationEntry: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        // width: "fit-content",
        borderBottom: "1.5px solid darkgray"
    },
    menuDrawer: {
      height: Dimensions.get("screen").height,
      width: "80%"
    },
    fab: {
      position: "absolute",
      top: Dimensions.get("screen").height * 0.75,
      left: Dimensions.get("screen").width * 0.8
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
        <IconButton
            icon={icon}
        />

        <Text>
          {text}
        </Text>
    </View>
  )
}

export default () => {
    const [session, _] = useAtom(sessionAtom)
    const navigation = useNavigation()
    const customerQuery = useQuery({
        queryKey: ["customer"],
        queryFn: () => fetchCustomer(session.customerId)
    })

    if (customerQuery.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    const {
        name,
        first_surname,
        second_surname,
        picture,
        phone_number
    } = customerQuery.data

    const navigateToEditProfile = () => {
      navigation.navigate("EditProfile")
    }

    return (
      <SafeAreaView style={styles.profileView}>
        <Avatar.Image
          size={175}
          source={{ uri: formatBase64String(picture) }}
        />

        <View style={styles.profileViewData}>
          <InformationEntry
              icon="account"
              text={`${name} ${first_surname} ${second_surname}`}
          />

          <InformationEntry
              icon="phone"
              text={phone_number}
          />
        </View>

        <FAB
          icon="pencil"
          onPress={navigateToEditProfile}
          style={styles.fab}
        />
      </SafeAreaView>
    )
}
