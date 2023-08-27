import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String } from '../utilities/formatting'
import LoadingSpinner from '../components/LoadingSpinner'
import { View, StyleSheet, Dimensions } from 'react-native'
import {
    Text,
    Avatar,
    IconButton
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
    avatar: {
      width: 175,
      height: 175,
      borderRadius: "50%"
    },
    menuDrawer: {
      height: Dimensions.get("screen").height,
      width: "80%"
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
    const customerQuery = useQuery({
        queryKey: ["customer"],
        queryFn: () => fetchCustomer(session.customerId)
    })

    if (customerQuery.isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    const {
        name,
        first_surname,
        second_surname,
        picture,
        phone_number
    } = customerQuery.data

    return (
      <View style={styles.profileView}>
        <Avatar.Image
          style={styles.avatar}
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
      </View>
    )
}
