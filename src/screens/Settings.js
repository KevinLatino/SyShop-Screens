import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { checkEmail, makeNotEmptyChecker } from '../utilities/validators'
import TextField from '../components/TextField'
import LoadingSpinner from '../components/LoadingSpinner'
import { View, StyleSheet } from 'react-native'
import {
  Text,
  List,
  Button,
  TouchableRipple,
  Divider,
  Surface,
  Portal,
  Modal
} from 'react-native-paper'

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    padding: 8
  }
})

const ChangeEmailModal = ({ onDismiss }) => {
  const [session, _] = useAtom(sessionAtom)
  const customerQuery = useQuery({
    queryKey: ["customerChangeEmail"],
    queryFn: () => fetchCustomer(session.customerId)
  })
  const changeEmailMutation = useMutation(
    ({ email, password }) => changeEmail(session.customerId, email, password)
  )
  const form = useForm(
    {
      email: customerQuery.data.email,
      password: ""
    },
    {
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )

  const handleSubmit = () => {
    changeEmailMutation.mutate(form.fields)
  }

  if (customerQuery.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  if (changeEmailMutation.isSuccess) {
    onDismiss()
  }

  return (
    <Surface elevation={5} style={styles.modal}>
      <TextField
        value={form.getField("email")}
        onChange={form.setField("email")}
        placeholder="Nuevo correo electrónico"
      />

      <TextField
        value={form.getField("password")}
        onChange={form.setField("password")}
        placeholder="Nuevo correo electrónico"
        secureTextEntry
      />

      <Button
        onPress={handleSubmit}
      >
        {
          changeEmailMutation.isLoading ?
          <LoadingSpinner /> :
          "Cambiar correo electrónico"
        }
      </Button>
    </Surface>
  )
}

const ChangePasswordModal = ({ onDismiss }) => {
  const [session, _] = useAtom(sessionAtom)
  const changePasswordMutation = useMutation(
    ({ oldPassword, newPassword }) => changePassword(session.customerId, oldPassword, newPassword)
  )
  const form = useForm(
    {
      oldPassword: "",
      newPassword: ""
    },
    {
      oldPassword: makeNotEmptyChecker("Contraseña vacía"),
      newPassword: makeNotEmptyChecker("Contraseña vacía")
    }
  )

  const handleSubmit = () => {
    changePasswordMutation.mutate(form.fields)
  }

  if (changeEmailMutation.isSuccess) {
    onDismiss()
  }

  return (
    <Surface elevation={5} style={styles.modal}>
      <TextField
        value={form.getField("newPassword")}
        onChange={form.setField("newPassword")}
        placeholder="Nueva contraseña"
        secureTextEntry
      />

      <TextField
        value={form.getField("oldPassword")}
        onChange={form.setField("oldPassword")}
        placeholder="Vieja contraseña"
        secureTextEntry
      />

      <Button
        onPress={handleSubmit}
      >
        {
          changePasswordMutation.isLoading ?
          <LoadingSpinner /> :
          "Cambiar contraseña"
        }
      </Button>
    </Surface>
  )
}

const SettingEntry = ({ heading, icon, onPress, ...listItemProps }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <List.Item
        title={heading}
        left={(props) => <List.Icon {...props} icon={icon} />}
        {...listItemProps}
      />
    </TouchableRipple>
  )
}

export default () => {
  const navigation = useNavigation()
  const [_, setSession] = useAtom(sessionAtom)
  const [isChangeEmailModalVisible, setIsChangeEmailModalVisible] = useState(false)
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false)

  const handleCloseSession = () => {
    setSession(null)
  }

  return (
    <View>
      <Text variant="titleLarge">
        Configuración
      </Text>

      <List.Section>
        <List.Subheader title="Historial" />

        <SettingEntry
          title="Publicaciones que te gustan"
          onPress={() => navigation.navigate("LikedPosts")}
        />

        <SettingEntry
          title="Tus compras"
          onPress={() => navigation.navigate("PurchasesList")}
        />

        <List.Subheader title="Tu cuenta" />

        <Divider />

        <SettingEntry
          heading="Cambiar correo electrónico"
          onPress={() => setIsChangeEmailModalVisible(true)}
        />

        <SettingEntry
          heading="Cambiar contraseña"
          onPress={() => setIsChangePasswordModalVisible(true)}
        />

        <SettingEntry
          heading="Cerrar sesión"
          onPress={handleCloseSession}
        />

        <SettingEntry
          heading="Eliminar cuenta"
          style={{ color: "red" }}
        />
      </List.Section>

      <Portal>
        <Modal
          visible={isChangeEmailModalVisible}
          onDismiss={() => setIsChangeEmailModalVisible(false)}
        >
          <ChangeEmailModal
            onDismiss={() => setIsChangeEmailModalVisible(false)}
          />
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={isChangePasswordModalVisible}
          onDismiss={() => setIsChangePasswordModalVisible(false)}
        >
          <ChangePasswordModal
            onDismiss={() => setIsChangePasswordModalVisible(false)}
          />
        </Modal>
      </Portal>
    </View>
  )
}
