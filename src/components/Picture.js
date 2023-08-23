import { Image } from 'react-native'

export default ({ source }) => {
    return (
        <Image
            source={{
                uri: `data:image/jpeg;base64,${source}`
            }}
        />
    )
}