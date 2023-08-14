import { Card } from 'react-native-paper'

export default ({ sale }) => {
    return (
        <Card>
            <Card.Cover source={{ uri: sale.post.multimedia[0] }}/>

            <Card.Title
                title={`${sale.post.title} (₡ ${sale.post.price})`}
                subtitle={sale.sale_date.purchase_date}
            />
        </Card>
    )
}