import React from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';

const SearchBarComponent = () => {
  return (
    <View>
      <SearchBar
        placeholder="Buscar..."
        containerStyle={{
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        inputContainerStyle={{
          backgroundColor: 'white',
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
  );
};

export default SearchBarComponent;