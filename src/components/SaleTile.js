import { Card } from 'react-native-paper'

export default ({ sale }) => {
    return (
        <Card>
            <Card.Cover source={{ uri: sale.post.picture }}/>

            <Card.Title
                title={}
            />
        </Card>
    )
}