import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { requestServer } from '../utilities/requests'
import { formatBase64String } from '../utilities/formatting'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Screen from '../components/Screen'
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
    Button,
    Divider
} from 'react-native-paper'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      rowGap: 16,
    },
    horizontalScrollView: {
        padding: 16
    },
    searchedTextDisplay: {
        padding: 8,
        backgroundColor: "red"
    },
    searchedTextWrapper: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      rowGap: 8,
      padding: 1,
      backgroundColor: "white",
      borderRadius: 12
    },
    postsResultsFiltersInnerView: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 8,
      padding: 20

    },
    postsResultsContainer: {
      flex: 1
    }
})

const fetchStores = async (searchedName) => {
    const payload = {
        search: searchedName
    }
    const stores = await requestServer(
        "/stores_service/search_stores_by_name",
        payload
    )

    return stores
}

const fetchPosts = async (text, categories, filters) => {
  const payload = {
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
        >
            {category}
        </Chip>
    )
}

const StoreTile = ({ store }) => {
    return (
        <Card style={{ width: 250 }} elevation={5}>
            <Card.Cover source={{ uri: formatBase64String(store.picture) }} />

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
        <View style={styles.searchedTextWrapper}>
            <IconButton
              icon="magnify"
              disabled
            />

            <Text variant="bodyMedium">
                {searchedText}
            </Text>
        </View>
      </View>
    )
}

const SortingPropertyFilterMenu = ({
    sortingProperty,
    onSelect,
    isVisible,
    setIsVisible
}) => {
    const handleSelect = (selectedSortingProperty) => {
      onSelect(selectedSortingProperty)

      setIsVisible(() => false)
    }

    const anchorText = sortingProperty === "publication_date" ?
      "Fecha de publicación" :
      "Precio"

    const anchor = (
        <Button
            onPress={() => setIsVisible(true)}
        >
          {anchorText}
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

    const handleToggleSortingSchema = () => {
      const newSortingSchema = sortingSchema === "ascending" ?
        "descending" :
        "ascending"

      onChangeFilters({
        ...filters,
        sortingSchema: newSortingSchema
      })
    }

    const handleChangePriceRange = ([newMinimumPrice, newMaximumPrice]) => {
      onChangeFilters({
        ...filters,
        minimumPrice: newMinimumPrice,
        maximumPrice: newMaximumPrice
      })
    }

    const handleSelectSortingProperty = (selectedSortingProperty) => {
      onChangeFilters(f => ({
        ...f,
        sortingProperty: selectedSortingProperty
      }))
    }

    const sortingIcon = sortingSchema === "ascending" ?
      "arrow-up-drop-circle-outline" :
      "arrow-down-drop-circle-outline"

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text variant="titleMedium">
              Ordernar por
            </Text>

            <View style={styles.postsResultsFiltersInnerView}>
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

            <Text variant="titleMedium">
              Rango de precio
            </Text>

            <View style={{ padding: 20 }}>
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
    const storesQuery = useQuery({
      queryKey: ["storesResults"],
      queryFn: () => fetchStores(searchedText)
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
        >
            {storesCards}
        </ReactNativeScrollView>
    )
}

const PostsResults = ({ searchedText, categoriesNames }) => {
    const [searchFilters, setSearchFilters] = useState({
        minimumPrice: 0,
        maximumPrice: null,
        sortingProperty: "publication_date",
        sortingSchema: "descending"
    })

    const handleChangeFilters = (newSearchFilters) => {
        setSearchFilters(newSearchFilters)

        postsQuery.refetch()
    }

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
        searchFilters
      ),
      enabled: maximumPriceQuery.isSuccess
    })

    if (maximumPriceQuery.isLoading) {
        return (
          <View style={styles.postsResultsContainer}>
            <LoadingSpinner inScreen />
          </View>
        )
    }

    return (
        <View style={styles.postsResultsContainer}>
            <PostsResultsFilters
                filters={searchFilters}
                onChangeFilters={handleChangeFilters}
            />

            <Divider />

            <View style={{ flex: 1 }}>
              {
                  postsQuery.isLoading ?
                  <LoadingSpinner inScreen /> :
                  <ScrollView
                      data={postsQuery.data}
                      keyExtractor={(post) => post.post_id}
                      renderItem={({ item }) => <PostTile post={item} />}
                  />
              }
            </View>
        </View>
    )
}

export default () => {
    const route = useRoute()

    const { text, categoriesNames } = route.params

    return (
      <Screen>
        <SearchedTextDisplay searchedText={text} />

        <ReactNativeScrollView>
          <SearchedCategoriesScrollView
              categoriesNames={categoriesNames}
          />

          <Text variant="titleLarge">
              Tiendas
          </Text>

          <StoresResultsScrollView
              searchedText={text}
          />

          <Text variant="titleLarge">
              Publicaciones
          </Text>

          <PostsResults
              searchedText={text}
              categoriesNames={categoriesNames}
          />
        </ReactNativeScrollView>
      </Screen>
    )
}
