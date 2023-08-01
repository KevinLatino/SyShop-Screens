import { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { selectPictureFromGallery } from '../utilities/camera'
import { showError } from '../components/AppSnackBar'
import { View } from 'react-native'
import { TouchableRipple, Avatar } from 'react-native-paper'

const PictureChooser = ({ image, onChangeImage }) => {
  const handleImageChange = async () => {
    try {
      const image = await selectPictureFromGallery()

      onChangeImage(image)
    } catch (error) {
      showError("Hubo un error al intentar seleccionar la imagen")
    }
  }

  return (
    <TouchableRipple
      onPress={handleImageChange}
    >
      <Avatar.Image source={{ uri: image }} />
    </TouchableRipple>
  )
}

export default () => {
  const route = useRoute()
  const [picture, setPicture] = useState(null)

  return (
    <View>
      <PictureChooser />
    </View>
  )
}