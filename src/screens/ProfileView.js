import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import { View, StyleSheet } from 'react-native'
import {
    Text,
    Avatar,
    IconButton,
    Modal,
    Portal,
    Drawer,
    Appbar,
    List,
    Surface
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
        width: "fit-content",
        borderBottom: "1.5px solid darkgray",
    },
    avatar: {
      width: 175,
      height: 175,
      borderRadius: "50%"
    },
    menuDrawer: {
      height: "100vh",
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

const Menu = () => {
    return (
      <Surface elevation={5} style={styles.menuDrawer}>
        <Drawer.Section>
            <List.Subheader>
                Configuración
            </List.Subheader>

            <List.Subheader>
                Otros
            </List.Subheader>

            <Drawer.Item
                label="Tus me gusta"
                onPress={() => navigation.navigate("LikedPosts")}
            />

            <Drawer.Item
                label="Tus compras"
                onPress={() => navigation.navigate("PurchasesList")}
            />
        </Drawer.Section>
      </Surface>
    )
}

const ProfileView = () => {
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
          source={{ uri: picture }}
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

export default () => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false)

    return (
        <View>
            <Appbar.Header>
                <Appbar.Action
                    icon="menu"
                    onPress={() => setIsDrawerVisible(true)}
                />
            </Appbar.Header>

            <ProfileView />

            <Portal>
              <Modal
                  visible={isDrawerVisible}
                  onDismiss={() => setIsDrawerVisible(false)}
              >
                  <Menu />
              </Modal>
            </Portal>
        </View>
    )
}
