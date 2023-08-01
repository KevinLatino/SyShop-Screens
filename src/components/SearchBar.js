import { useState } from 'react'
import { useQuery, requestServer } from '../utilities/requests'
import { View, StyleSheet } from 'react-native'
import {
  List,
  ActivityIndicator,
  Chip
} from 'react-native-paper'
import { SearchBar } from 'react-native-elements';


const styles = StyleSheet.create({
  selectedFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    gap: "0.25rem",
    padding: "0.25rem"
  }
})

const fetchCategories = async (text) => {
  if (text === "") {
    return []
  }

  const payload = {
    search: text,
    start: 0,
    amount: 3
  }
  const categoriesNames = await requestServer(
    "/categories_service/search_categories_by_name",
    payload
  )

  return categoriesNames
}

const fetchStores = async (text) => {
  if (text === "") {
    return []
  }

  const payload = {
    search: text,
    start: 0,
    amount: 3
  }

  const storesNames = await requestServer(
    "/stores_service/search_stores_by_name",
    payload
  )

  return storesNames
}

const makeToggler = (array, setArray) => {
  const toggler = (element) => {
    if (array.includes(element)) {
      const newArray = array
        .filter((e) => e !== element)

      setArray(newArray)
    } else {
      const newArray = [...array, element]

      setArray(newArray)
    }
  }

  return toggler
}

const SelectedFiltersList = ({ names, onChipClose, chipsIcon, chipsStyle }) => {
  const chips = names
    .map((name) => {
      return (
        <Chip
          key={name}
          onClose={() => onChipClose(name)}
          icon={chipsIcon}
          closeIcon="close"
          style={{
            ...chipsStyle,
            width: "fit-content"
          }}
        >
          {name}
        </Chip>
      )
    })

  return (
    <View style={styles.selectedFiltersContainer}>
      {chips}
    </View>
  )
}

const RecommendedFiltersList = ({ names, onTilePress, tilesIcon, tilesStyle }) => {
  if (names === null) {
    return (
      <View>
        <ActivityIndicator animating />
      </View>
    )
  }

  const listItems = names
      .map((name) => {
        return (
          <List.Item
            key={name}
            title={name}
            left={(props) => <List.Icon {...props} icon={tilesIcon} />}
            onPress={() => onTilePress(name)}
            style={tilesStyle}
          />
        )
      })

  return (
    <View>
      {listItems}
    </View>
  )
}

export default ({ onSearchSubmit }) => {
  const [text, setText] = useState("")
  const [categoriesNames, setCategoriesNames] = useState([])
  const [storesNames, setStoresNames] = useState([])
  const categoriesQuery = useQuery(() => fetchCategories(text))
  const storesQuery = useQuery(() => fetchStores(text))

  const toggleCategoryName = (categoryName) => {
    makeToggler(categoriesNames, setCategoriesNames)(categoryName)

    setText("")
  }

  const toggleStoreName = (storeName) => {
    makeToggler(storesNames, setStoresNames)(storeName)

    setText("")
  }

  const handleSearchUpdate = (newText) => {
    setText(newText)

    categoriesQuery.refresh()
    storesQuery.refresh()
  }

  const handleSearchSubmit = () => {
    onSearchSubmit(
      text,
      categoriesNames,
      storesNames
    )
  }

  return (
    <View>
       <View>
      <SearchBar
        placeholder="Buscar..."
        value={text}
        onChangeText={handleSearchUpdate}
        onSubmitEditing={handleSearchSubmit}
        containerStyle={{
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        inputContainerStyle={{
          backgroundColor: '#f0f0f0f',
          borderRadius: 20,
          border: 1,
          borderColor: 'grey',
          width: 395,
        }}
        inputStyle={{
          fontSize: 16,
        }}
      />
    </View>

    

      <View>
        <SelectedFiltersList
          names={categoriesNames}
          onChipClose={(categoryName) => toggleCategoryName(categoryName)}
          chipsIcon="shape"
        />

        <SelectedFiltersList
          names={storesNames}
          onChipClose={(storeName) => toggleStoreName(storeName)}
          chipsIcon="store"
        />
      </View>

      <List.Section>
        <List.Subheader>
          Categorías
        </List.Subheader>

        <RecommendedFiltersList
          names={categoriesQuery.result}
          onTilePress={(categoryName) => toggleCategoryName(categoryName)}
          tilesIcon="shape"
        />

        <List.Subheader>
          Tiendas
        </List.Subheader>

        <RecommendedFiltersList
          names={storesQuery.result}
          onTilePress={(storeName) => toggleStoreName(storeName)}
          tilesIcon="store"
        />
      </List.Section>
    </View>
  )
}
