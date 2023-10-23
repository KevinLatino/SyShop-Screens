import { useState, useEffect, Fragment } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import StoreTile from '../components/StoreTile'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchInput from '../components/SearchInput'
import Slider from '../components/Slider'
import Button from '../components/Button'
import SegmentedControl from '@react-native-community/segmented-control'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet } from 'react-native'
import { Caption1 } from 'react-native-ios-kit'
import { IconButton, Portal, Modal } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    backgroundColor: "white",
    justifyContent: "flex-start",
    gap: 15
  },
  screenSelector: {
    padding: 8,
    backgroundColor: configuration.BACKGROUND_COLOR
  },
  searchFiltersModal: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 15,
    alignSelf: "center"
  },
  horizontalScrollView: {
    backgroundColor: "white",
    gap: 10
  },
  postsResultsContainer: {
    flex: 1,
    gap: 15
  },
  postsResultsFilters: {
    gap: 30,
    padding: 10
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

const PriceRangeSlider = ({
  limitPrice,
  minimumPrice,
  maximumPrice,
  onChangePriceRange
}) => {
  return (
    <View>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
          ₡0
        </Caption1>

        <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
          ₡{limitPrice}
        </Caption1>
      </View>

      <Slider
        minimumValue={0}
        maximumValue={limitPrice}
        selectedMinimumValue={minimumPrice}
        selectedMaximumValue={maximumPrice}
        onChange={onChangePriceRange}
        step={100}
      />
    </View>
  )
}

const ScreenSelector = ({ value, onChange }) => {
  return (
    <View style={styles.screenSelector}>
      <SegmentedControl
        values={["Publicaciones", "Tiendas"]}
        selectedIndex={value}
        onChange={(event) => onChange(event.nativeEvent.selectedSegmentIndex)}
        backgroundColor={configuration.BACKGROUND_COLOR}
        tintColor={configuration.ACCENT_COLOR_1}
        fontStyle={{ color: "white" }}
        activeFontStyle={{ color: "white" }}
      />
    </View>
  )
}

const SearchFiltersModal = ({
  limitPrice,
  value,
  onChange,
  isVisible,
  onDismiss
}) => {
  const [valueState, setValueState] = useState(value)

  const handleSelectSortingPropertyIndex = (event) => {
    const newIndex = event.nativeEvent.selectedSegmentIndex

    setValueState({
      ...valueState,
      sortingPropertyIndex: newIndex
    })
  }

  const handleChangePriceRange = ([newMinimumPrice, newMaximumPrice]) => {
    setValueState({
      ...valueState,
      minimumPrice: newMinimumPrice,
      maximumPrice: newMaximumPrice
    })
  }

  const handleApplyFilters = () => {
    onDismiss()

    onChange(valueState)
  }

  return (
    <Modal
      visible={isVisible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.searchFiltersModal}
    >
      <View style={styles.postsResultsFilters}>
        <SegmentedControl
          values={["Precio", "Fecha de publicación"]}
          selectedIndex={valueState.sortingPropertyIndex}
          onChange={handleSelectSortingPropertyIndex}
          backgroundColor={configuration.BACKGROUND_COLOR}
          tintColor={configuration.ACCENT_COLOR_1}
          fontStyle={{ color: "white" }}
          activeFontStyle={{ color: "white" }}
        />

        {
          valueState.sortingPropertyIndex === 0 ?
          <PriceRangeSlider
            limitPrice={limitPrice}
            minimumPrice={valueState.minimumPrice}
            maximumPrice={valueState.maximumPrice}
            onChangePriceRange={handleChangePriceRange}
          /> :
          null
        }

        <Button
          style={{ width: "100%" }}
          onPress={handleApplyFilters}
        >
          Aplicar filtros
        </Button>
      </View>
    </Modal>
  )
}

const StoresList = ({ searchedText }) => {
  const storesQuery = useQuery({
    queryKey: ["storesResults"],
    queryFn: () => fetchStores(searchedText)
  })

  if (storesQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <ScrollView
      data={storesQuery.data}
      keyExtractor={(store) => store.store_id}
      renderItem={({ item }) => <StoreTile store={item} />}
      emptyIcon="basket"
      message="No se encontraron resultados de tiendas"
    />
  )
}

const PostsList = ({ searchedText, categoriesNames }) => {
  const queryClient = useQueryClient()

  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    minimumPrice: 0,
    maximumPrice: null,
    sortingPropertyIndex: 0
  })

  const handleChangeFilters = (newSearchFilters) => {
    setSearchFilters(newSearchFilters)
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
      {
        minimumPrice: searchFilters.minimumPrice,
        maximumPrice: searchFilters.maximumPrice,
        sortingProperty: ["price", "sent_datetime"][searchFilters.sortingPropertyIndex],
        sortingSchema: "ascending"
      }
    ),
    enabled: maximumPriceQuery.isSuccess
  })

  useEffect(() => {
    queryClient.refetchQueries({
      queryKey: ["postsResults"]
    })
  }, [searchFilters])

  if (maximumPriceQuery.isLoading || postsQuery.isFetching) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Fragment>
      <View style={{ padding: 10, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
        <IconButton
          icon="tune"
          iconColor={configuration.ACCENT_COLOR_1}
          style={{ backgroundColor: "white", borderWidth: 1, borderColor: configuration.ACCENT_COLOR_1 }}
          onPress={() => setIsFiltersModalVisible(true)}
        />
      </View>

      <ScrollView
        data={postsQuery.data}
        keyExtractor={(post) => post.post_id}
        renderItem={({ item }) => <PostTile post={item} />}
        emptyIcon="basket"
        emptyMessage="No se encontraron resultados de publicaciones"
      />

      <Portal>
        <SearchFiltersModal
          limitPrice={maximumPriceQuery.data}
          value={searchFilters}
          onChange={handleChangeFilters}
          isVisible={isFiltersModalVisible}
          onDismiss={() => setIsFiltersModalVisible(false)}
        />
      </Portal>
    </Fragment>
  )
}

export default () => {
  const route = useRoute()

  const { text, categoriesNames } = route.params

  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)

  const getCurrentScreen = () => {
    switch (currentScreenIndex) {
      case 1:
        return (
          <StoresList
            searchedText={text}
          />
        )

      case 0:
        return (
          <PostsList
            searchedText={text}
            categoriesNames={categoriesNames}
          />
        )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        value={text}
        showCancel={false}
        disabled
      />

      <ScreenSelector
        value={currentScreenIndex}
        onChange={setCurrentScreenIndex}
      />

      <View style={{ flex: 1, padding: 15 }}>
        {getCurrentScreen()}
      </View>
    </SafeAreaView>
  )
}
