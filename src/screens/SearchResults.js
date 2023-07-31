import { useRoute } from '@react-navigation/native'
import useCounter from '../hooks/useCounter'
import { useQuery, requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import {
    View,
    ScrollView as ReactNativeScrollView,
    StyleSheet
} from 'react-native'
import { Chip, Text } from 'react-native-paper'

const styles = StyleSheet.create({
    scrollView: {
        rowGap: "0.5rem",
        padding: "0.3rem"
    }
})

const fetchStores = async (searchedName, pageNumber) => {
    const payload = {
        start: pageNumber * 5,
        amount: 5,
        search: searchedName
    }
    const stores = await requestServer(
        "/stores_service/search_stores_by_name",
        payload
    )

    return stores
}

const CategoriesScrollView = ({ categoriesNames }) => {
    const categoriesNamesChips = categoriesNames.map((categoryName) => {
        return (
            <Chip
                key={categoryName}
                icon="shape"
                style={{ width: "fit-content" }}
            >
                {categoryName}
            </Chip>
        )
    })

    return (
        <ReactNativeScrollView
            horizontal
            style={styles.scrollView}
        >
            {categoriesNamesChips}
        </ReactNativeScrollView>
    )
}

const StoresScrollView = ({ stores, ...scrollViewProps }) => {
    return (
        <ReactNativeScrollView
            horizontal
            style={styles.scrollView}
        >
        </ReactNativeScrollView>
    )
}

export default () => {
    const route = useRoute()
    const storesPageNumber = useCounter()

    const { text, categoriesNames } = route.params
    const storesQuery = useQuery(() => fetchStores(text, storesPageNumber.value))

    return (
        <View>
            <CategoriesScrollView
                categoriesNames={categoriesNames}
            />

            <Text variant="titleMedium">
                Tiendas
            </Text>

            <StoresScrollView
                stores={storesQuery.result}
                onEndReached={storesPageNumber.increment}
            />
        </View>
    )
}