import { useState } from 'react'
import { useQuery, requestServer } from '../utilities/requests'
import useForm from '../hooks/useForm'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { selectPictureFromGallery } from '../utilities/camera'
import { showError } from '../components/AppSnackBar'
import { View, StyleSheet } from 'react-native'
import {
  TouchableRipple,
  Avatar,
  ActivityIndicator
} from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: "1rem",
    padding: "1.25rem"
  }
})

const PictureChooser = ({ picture, onChangePicture }) => {
  const handlePictureChange = async () => {
    try {
      const picture = await selectPictureFromGallery()

      onChangePicture(picture)
    } catch (error) {
      showError("Hubo un error al intentar seleccionar la imagen")
    }
  }

  return (
    <TouchableRipple
      onPress={handlePictureChange}
    >
      <Avatar.Image source={{ uri: picture }} />
    </TouchableRipple>
  )
}

export default () => {
  const [session, _] = useAtom(sessionAtom)
  const customerQuery = useQuery(() => fetchCustomer(session.customerId))

  if (customerQuery.result === null) {
    return (
      <View>
        <ActivityIndicator animating={true} />
      </View>
    )
  }

  const [picture, setPicture] = useState(customerQuery.result.picture)
  const form = useForm(
    {
      name: "",
      firstSurname: "",
      secondSurname: "",
      phoneNumber: ""
    },
    {
      // Pendiente
    }
  )

  return (
    <View style={styles.container}>
      <PictureChooser
        picture={picture}
        onChangePicture={setPicture}
      />
    </View>
  )
}
