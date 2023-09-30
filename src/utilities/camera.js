import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

export const selectPictureFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
    })

    if (result.canceled) {
      Alert.alert(
        "Cancelaste la selección de la foto"
      )

      return
    }

    const picture = result.assets[0].base64

    return picture
}
