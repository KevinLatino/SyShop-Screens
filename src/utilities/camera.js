import * as ImagePicker from 'expo-image-picker'
import { showMessage } from '../components/AppSnackBar'

export const selectPictureFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
    })

    if (result.canceled) {
      showMessage("Cancelaste la selección de la foto")

      return
    }

    const picture = result.assets[0].base64

    return picture
}
