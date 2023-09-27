import { formatBase64String } from '../utilities/formatting'
import { Card } from 'react-native-paper'

export default ({ sale }) => {
  console.log(sale)
    return (
        <Card>
            <Card.Cover source={{ uri: formatBase64String(sale.post.multimedia[0]) }}/>

            <Card.Title
                title={`${sale.post.title} (₡ ${sale.post.price})`}
                subtitle={sale.sale_date.purchase_date}
            />
        </Card>
    )
}
