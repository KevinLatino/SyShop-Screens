import { SearchBar } from 'react-native-ios-kit'

export default ({ ...searchBarProps }) => {
  return (
    <SearchBar
      {...searchBarProps}
      withCancel
      animated
    />
  )
}
