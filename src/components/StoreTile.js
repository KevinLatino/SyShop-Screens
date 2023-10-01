import { formatBase64String } from '../utilities/formatting'
import { View, Image } from 'react-native'
import { Card } from '@ui-kitten/components'
import { Caption1 } from 'react-native-ios-kit'

export default ({ store }) => {
  const footer = (
    <View>
      <Caption1>
        {store.name}
      </Caption1>

      <Caption1>
        {store.description}
      </Caption1>
    </View>
  )

  return (
    <Card footer={footer}>
      <Image
        source={{
          uri: formatBase64String(store.picture)
        }}
      />
    </Card>
  )
}
