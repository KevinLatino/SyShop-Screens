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
    StyleSheet,
    ScrollView as ReactNativeScrollView
} from 'react-native'
import {
    Card,
    Chip,
    IconButton,
    Text,
    Menu,
    Button
} from 'react-native-paper'

const styles = StyleSheet.create({
    horizontalScrollView: {
        rowGap: 8,
        padding: 5
    },
    searchedTextDisplay: {
        padding: 8,
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

const fetchPosts = async (text, categories, filters, pageNumber) => {
  console.log(filters)
  const payload = {
    start: pageNumber * 20,
    amount: 20,
    searched_text: text,
    categories,
    sorting_property: filters.sortingProperty,
    sorting_schema: filters.sortingSchema,
    minimum_price: filters.minimumPrice,
    maximum_price: filters.maximumPrice
  }

  const posts = await requestServer(
    "/posts_service/search_posts_by_metadata",
    payload
  )

  return posts
}

const fetchMaximumPrice = async () => {
  const maximumPrice = await requestServer(
    "/posts_service/get_maximum_price"
  )

  return maximumPrice
}

const CategoryChip = ({ category }) => {
    return (
        <Chip
            icon="shape"
            // style={{ width: "fit-content" }}
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
    const anchorText = sortingProperty === "publication_date" ?
      "Fecha de publicación" :
      "Precio"
    const anchor = (
        <Button
            mode="outlined"
            onPress={() => setIsVisible(true)}
        >
          {anchorText}
        </Button>
    )

    const handleSelect = (selectedSortingProperty) => {
      onSelect(selectedSortingProperty)

      setIsVisible(() => false)
    }

    return (
        <Menu
            visible={isVisible}
            onDismiss={() => setIsVisible(false)}
            anchor={anchor}
        >
            <Menu.Item
                title="Fecha de publicación"
                onPress={() => handleSelect("publication_date")}
            />

            <Menu.Item
                title="Precio"
                onPress={() => handleSelect("price")}
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

    const sortingIcon = sortingSchema === "ascending" ?
      "arrow-up-drop-circle-outline" :
      "arrow-down-drop-circle-outline"

    const handleToggleSortingSchema = () => {
      const newSortingSchema = sortingSchema === "ascending" ?
        "descending" :
        "ascending"

      onChangeFilters({
        ...filters,
        sortingSchema: newSortingSchema
      })
    }

    const handleSelectSortingProperty = (selectedSortingProperty) => {
      onChangeFilters(f => ({
        ...f,
        sortingProperty: selectedSortingProperty
      }))
    }

    const handleChangePriceRange = ([newMinimumPrice, newMaximumPrice]) => {
      onChangeFilters({
        ...filters,
        minimumPrice: newMinimumPrice,
        maximumPrice: newMaximumPrice
      })
    }

    return (
        <View>
            <View>
                <IconButton
                    mode="outlined"
                    icon={sortingIcon}
                    onPress={handleToggleSortingSchema}
                />

                <SortingPropertyFilterMenu
                    isVisible={isMenuVisible}
                    setIsVisible={setIsMenuVisible}
                    sortingProperty={sortingProperty}
                    onSelect={handleSelectSortingProperty}
                />
            </View>

            <View>
                <Slider
                    minimumValue={0}
                    maximumValue={maximumPrice}
                    step={1000}
                    value={[minimumPrice, maximumPrice]}
                    onValueChange={handleChangePriceRange}
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
    const storesQuery = useQuery({
      queryKey: ["storesResults"],
      queryFn: () => fetchStores(searchedText, pageNumber.value)
    })

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

const PostsResults = ({ searchedText, categoriesNames }) => {
    const pageNumber = useCounter()
    const [searchFilters, setSearchFilters] = useState({
        minimumPrice: 0,
        maximumPrice: null,
        sortingProperty: "publication_date",
        sortingSchema: "descending"
    })
    const maximumPriceQuery = useQuery({
      queryKey: ["maximumPrice"],
      queryFn: () => fetchMaximumPrice(),
      onSuccess: (maximumPrice) => setSearchFilters({
        ...searchFilters,
        maximumPrice
      })
    })
    const postsQuery = useQuery({
      queryKey: ["postsResults"],
      queryFn: () => fetchPosts(
        searchedText,
        categoriesNames,
        searchFilters,
        pageNumber.value
      ),
      enabled: maximumPriceQuery.isSuccess
    })

    const handleChangeFilters = (newSearchFilters) => {
        setSearchFilters(newSearchFilters)

        postsQuery.refetch()
    }

    if (maximumPriceQuery.isLoading) {
        return (
            <LoadingSpinner />
        )
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
                categoriesNames={categoriesNames}
            />
        </View>
    )
}
