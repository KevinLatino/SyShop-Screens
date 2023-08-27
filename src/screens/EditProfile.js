import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { requestServer } from '../utilities/requests'
import { useForm } from '../utilities/hooks'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { selectPictureFromGallery } from '../utilities/camera'
import { showMessage } from '../components/AppSnackBar'
import { makeNotEmptyChecker, checkPhoneNumber } from '../utilities/validators'
import { formatBase64String } from '../utilities/formatting'
import TextField from '../components/TextField'
import LoadingSpinner from '../components/LoadingSpinner'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { Button, TouchableRipple, Avatar } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 16,
    padding: 20
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

const updateCustomer = async (customerId, newCustomer) => {
  const payload = {
    customer_id: customerId,
    ...newCustomer
  }
  const _ = await requestServer(
    "/customers_service/update_customer",
    payload
  )
}

const PictureChooser = ({ picture, onChangePicture }) => {
  const handlePictureChange = async () => {
    try {
      const picture = await selectPictureFromGallery()

      onChangePicture(picture)
    } catch (error) {
      showMessage("Hubo un error al intentar seleccionar la imagen")
    }
  }

  return (
    <TouchableRipple
      onPress={handlePictureChange}
    >
      <Avatar.Image source={{ uri: formatBase64String(picture) }} />
    </TouchableRipple>
  )
}

export default () => {
  const [session, _] = useAtom(sessionAtom)
  const customerQuery = useQuery(
    "customerToEdit",
    () => fetchCustomer(session.customerId)
  )

  if (customerQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const [picture, setPicture] = useState(customerQuery.data.picture)
  const form = useForm(
    {
      name: customerQuery.data.name,
      first_surname: customerQuery.data.first_surname,
      second_surname: customerQuery.data.second_surname,
      phone_number: customerQuery.data.phone_number
    },
    {
      name: makeNotEmptyChecker("Nombre vacío"),
      first_surname: makeNotEmptyChecker("Primer apellido vacío"),
      second_surname: makeNotEmptyChecker("Segundo apellido vacío"),
      phone_number: checkPhoneNumber
    }
  )
  const updateCustomerMutation = useMutation(
    (customerId, fields) => updateCustomer(customerId, fields)
  )

  return (
    <SafeAreaView style={styles.container}>
      <PictureChooser
        picture={picture}
        onChangePicture={setPicture}
      />

      <TextField
        value={form.getField("name")}
        onChangeText={form.setField("name")}
        error={form.getError("name")}
        placeholder="Nombre"
      />

      <TextField
        value={form.getField("first_surname")}
        onChangeText={form.setField("first_surname")}
        error={form.getError("first_surname")}
        placeholder="Primer apellido"
      />

      <TextField
        value={form.getField("second_surname")}
        onChangeText={form.setField("second_surname")}
        error={form.getError("second_surname")}
        placeholder="Segundo apellido"
      />

      <TextField
        value={form.getField("phone_number")}
        onChangeText={form.setField("phone_number")}
        error={form.getError("phone_number")}
        placeholder="Número telefónico"
      />

      <Button
        mode="contained"
        onPress={
          () => updateCustomerMutation.mutate(session.customerId, form.fields)
        }
        disabled={form.hasErrors()}
      >
        {
          updateCustomerMutation.isLoading ?
          <LoadingSpinner /> :
          "Confirmar"
        }
      </Button>
    </SafeAreaView>
  )
}
