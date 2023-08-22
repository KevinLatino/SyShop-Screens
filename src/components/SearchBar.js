import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { requestServer } from '../utilities/requests'
import SearchInput from './SearchInput'
import LoadingSpinner from './LoadingSpinner'
import { View, StyleSheet } from 'react-native'
import { List, Chip } from 'react-native-paper'

const styles = StyleSheet.create({
  selectedCategoriesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    gap: 4,
    padding: 4
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

const SelectedCategoriesList = ({ categoriesNames, onDelete }) => {
  const chips = categoriesNames
    .map((categoryName) => {
      return (
        <Chip
          key={categoryName}
          onClose={() => onDelete(categoryName)}
          icon="shape"
          closeIcon="close"
          // style={{ width: "fit-content" }}
        >
          {categoryName}
        </Chip>
      )
    })

  return (
    <View style={styles.selectedCategoriesList}>
      {chips}
    </View>
  )
}

const RecommendedCategoriesList = ({ categoriesNames, onToggle }) => {
  const listItems = categoriesNames
      .map((categoryName) => {
        return (
          <List.Item
            key={categoryName}
            title={categoryName}
            left={(props) => <List.Icon {...props} icon="shape" />}
            onPress={() => onToggle(categoryName)}
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
  const categoriesQuery = useQuery({
    queryKey: ["foundCategories"],
    queryFn: () => fetchCategories(text)
  })

  const toggleCategoryName = (categoryName) => {
    if (categoriesNames.includes(categoryName)) {
      const newCategoriesNames = categoriesNames
        .filter((c) =>  c !== categoryName)

      setCategoriesNames(newCategoriesNames)
    } else {
      const newCategoriesNames = [...categoriesNames, categoryName]

      setCategoriesNames(newCategoriesNames)
    }

    setText("")
  }

  const handleSearchUpdate = (newText) => {
    setText(newText)

    categoriesQuery.refetch()
  }

  return (
    <View>
      <View>
        <SearchInput
          placeholder="Buscar..."
          value={text}
          onChangeText={handleSearchUpdate}
          onSubmitEditing={() => onSearchSubmit(text, categoriesNames)}
        />
      </View>

      <View>
        <SelectedCategoriesList
          categoriesNames={categoriesNames}
          onDelete={toggleCategoryName}
        />
      </View>

      <List.Section>
        <List.Subheader>
          Categorías
        </List.Subheader>

        {
          categoriesQuery.isLoading ?
          <LoadingSpinner /> :
          <RecommendedCategoriesList
            categoriesNames={categoriesQuery.data}
            onToggle={toggleCategoryName}
          />
        }
      </List.Section>
    </View>
  )
}
