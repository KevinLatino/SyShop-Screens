import * as ImagePicker from 'expo-image-picker'

export const selectPictureFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
    })

    if (result.canceled) {
        throw Error("Image selection was cancelled")
    }

    const picture = result.assets[0].base64

    return picture
}