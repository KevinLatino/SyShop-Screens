import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { useCounter} from '../utilities/hooks'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import LoadingSpinner from '../components/LoadingSpinner'
import { Slider } from '@miblanchard/react-native-slider'
import {
    View,
    ScrollView as ReactNativeScrollView,
    StyleSheet
} from 'react-native'
import {
    Card,
    Chip,
    IconButton,
    Text,
    Menu,
    ActivityIndicator,
    Button
} from 'react-native-paper'

const styles = StyleSheet.create({
    horizontalScrollView: {
        rowGap: "0.5rem",
        padding: "0.3rem"
    },
    searchedTextDisplay: {
        padding: "0.5rem",
        borderRadius: 10
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

const CategoryChip = ({ category }) => {
    return (
        <Chip
            icon="shape"
            style={{ width: "fit-content" }}
        >
            {category}
        </Chip>
    )
}

const StoreTile = ({ store }) => {
    return (
        <Card>
            <Card.Cover source={{ uri: store.picture }} />

            <Card.Title title={store.name} />

            <Card.Content>
                <Text variant="bodyMedium">
                    {store.description}
                </Text>
            </Card.Content>
        </Card>
    )
}

const SearchedTextDisplay = ({ searchedText }) => {
    return (
        <View style={styles.searchedTextDisplay}>
            <Text variant="bodyMedium">
                {searchedText}
            </Text>
        </View>
    )
}

const SortingPropertyFilterMenu = ({
    sortingProperty,
    onSelect,
    isVisible,
    setIsVisible
}) => {
    const anchor = (
        <Button
            mode="outlined"
            onPress={() => setIsVisible(true)}
        >
            {
                sortingProperty === "publication_date"
                    ? "Fecha de publicación"
                    : "Precio"
            }
        </Button>
    )

    return (
        <Menu
            visible={isVisible}
            onDismiss={() => setIsVisible(false)}
            anchor={anchor}
        >
            <Menu.Item
                title="Fecha de publicación"
                onPress={() => onSelect("publication_date")}
            />

            <Menu.Item
                title="Precio"
                onPress={() => onSelect("price")}
            />
        </Menu>
    )
}

const PostsResultsFilters = ({ filters, onChangeFilters }) => {
    const {
        minimumPrice,
        maximumPrice,
        sortingProperty,
        sortingSchema
    } = filters
    const [isMenuVisible, setIsMenuVisible] = useState(false)

    return (
        <View>
            <View>
                <IconButton
                    mode="outlined"
                    icon={
                        sortingSchema === "ascending"
                        ? "arrow-up-drop-circle-outline"
                        : "arrow-down-drop-circle-outline"
                    }
                    onPress={() => onChangeFilters({
                        ...filters,
                        sortingSchema: sortingSchema === "ascending"
                            ? "descending"
                            : "ascending"
                    })}
                />

                <SortingPropertyFilterMenu
                    isVisible={isMenuVisible}
                    setIsVisible={setIsMenuVisible}
                    sortingProperty={sortingProperty}
                    onSelect={(sortingProperty) => onChangeFilters({
                        ...filters,
                        sortingProperty
                    })}
                />
            </View>

            <View>
                <Slider
                    minimumValue={0}
                    maximumValue={maximumPrice}
                    step={1000}
                    value={[minimumPrice, maximumPrice]}
                    onValueChange={([minimum, maximum]) => onChangeFilters({
                        ...filters, minimumPrice: minimum, maximumPrice: maximum
                    })}
                />
            </View>
        </View>
    )
}

const SearchedCategoriesScrollView = ({ categoriesNames }) => {
    const categoriesNamesChips = categoriesNames.map((categoryName) => {
        return (
            <CategoryChip
                key={categoryName}
                category={categoryName}
            />
        )
    })

    return (
        <ReactNativeScrollView
            horizontal
            style={styles.horizontalScrollView}
        >
            {categoriesNamesChips}
        </ReactNativeScrollView>
    )
}

const StoresResultsScrollView = ({ searchedText }) => {
    const pageNumber = useCounter()
    const storesQuery = useQuery(
        "stores",
        () => fetchStores(searchedText, pageNumber.value)
    )

    if (storesQuery.isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    const storesCards = storesQuery.data.map((store) => {
        return (
            <StoreTile
                key={store.user_id}
                store={store}
            />
        )
    })

    return (
        <ReactNativeScrollView
            horizontal
            style={styles.horizontalScrollView}
            onEndReached={pageNumber.increment}
        >
            {storesCards}
        </ReactNativeScrollView>
    )
}

const PostsResults = ({ searchedText }) => {
    const maximumPriceQuery = useQuery(
        "maximumPrice",
        () => fetchMaximumPrice()
    )

    if (maximumPriceQuery.isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    const pageNumber = useCounter()
    const [searchFilters, setSearchFilters] = useState({
        minimumPrice: 0,
        maximumPrice: maximumPriceQuery.data,
        sortingProperty: "publicacion_date",
        sortingSchema: "descending"
    })
    const postsQuery = useQuery(
        "postsResults",
        () => fetchPosts(
            searchedText,
            searchFilters,
            pageNumber.value
        )
    )

    const handleChangeFilters = (newSearchFilters) => {
        setSearchFilters(newSearchFilters)

        postsQuery.refetch()
    }

    return (
        <View>
            <PostsResultsFilters
                filters={searchFilters}
                onChangeFilters={handleChangeFilters}
            />

            {
                postsQuery.isLoading ?
                <LoadingSpinner /> :
                <ScrollView
                    data={postsQuery.data}
                    renderItem={(post) => <PostTile post={post} />}
                    onEndReached={pageNumber.increment}
                />
            }
        </View>
    )
}

export default () => {
    const route = useRoute()
    const { text, categoriesNames } = route.params

    return (
        <View>
            <SearchedTextDisplay searchedText={text} />

            <SearchedCategoriesScrollView
                categoriesNames={categoriesNames}
            />

            <Text variant="titleMedium">
                Tiendas
            </Text>

            <StoresResultsScrollView
                searchedText={text}
            />

            <Text variant="titleMedium">
                Publicaciones
            </Text>

            <PostsResults
                searchedText={text}
            />
        </View>
    )
}