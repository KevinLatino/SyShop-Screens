import { launchImageLibrary } from 'react-native-image-picker'

export class GalleryError extends Error {
    constructor(errorCode) {
        this.errorCode = errorCode
    }
}

export const selectPictureFromGallery = async () => {
    const chooseResponse = await launchImageLibrary({
        includeBase64: true,
        selectionLimit: 1
    })

    if (chooseResponse.didCancel) {
        return null
    }

    if (chooseResponse.errorCode !== null) {
        throw GalleryError(chooseResponse.errorCode)
    }

    const [image] = chooseResponse.assets

    return image.base64
}