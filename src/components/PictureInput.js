import { TouchableRipple, Avatar } from 'react-native-paper'
import { selectPictureFromGallery } from '../utilities/camera'

export default ({ picture, onChangePicture, ...avatarProps }) => {
  const handleChangePicture = async () => {
    const newPicture = await selectPictureFromGallery()

    console.log(newPicture)

    onChangePicture(newPicture)
  }

  return (
    <TouchableRipple
      onPress={handleChangePicture}
    >
      <Avatar.Image
        source={{ uri: picture }}
        {...avatarProps}
      />
    </TouchableRipple>
  )
}
