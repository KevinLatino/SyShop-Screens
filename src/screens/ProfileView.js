import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import { View, StyleSheet } from 'react-native'
import {
    Avatar,
    IconButton,
    Modal,
    Drawer,
    Appbar,
    List
} from 'react-native-paper'

const styles = StyleSheet.create({
    informationEntry: {
        border: "none",
        borderBottom: "1.5px solid darkgray"
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
    <View style={styles.informationEntry}>
        <IconButton
            icon={icon}
        />

        <Text>
            {text}
        </Text>
    </View>
}

const Menu = () => {
    const navigation = useNavigation()

    return (
        <Drawer.Section>
            <Drawer.Item
                label="Tus me gustas"
                onPress={() => navigation.navigate("LikedPosts")}
            />

            <Drawer.Item
                label="Tus compras"
                onPress={() => navigation.navigate("PurchasesList")}
            />

            <List.Subheader>
                Configuración
            </List.Subheader>
        </Drawer.Section>
    )
}

export default () => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false)
    const [session, _] = useAtom(sessionAtom)
    const customerQuery = useQuery({
        queryKey: "customer",
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
        <View>
            <Appbar.Header>
                <Appbar.Action
                    icon="menu"
                    onPress={() => setIsDrawerVisible(true)}
                />
            </Appbar.Header>

            <Avatar source={{ uri: picture }} />

            <InformationEntry
                icon="account"
                text={`${name} ${first_surname} ${second_surname}`}
            />

            <InformationEntry
                icon="phone"
                text={phone_number}
            />

            <Modal
                visible={isDrawerVisible}
                onDismiss={() => setIsDrawerVisible(false)}
            >
                <Menu />
            </Modal>
        </View>
    )
}