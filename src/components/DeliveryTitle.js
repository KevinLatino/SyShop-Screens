import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, List } from 'react-native-paper';

const ContactItem = ({ name, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.deliverItemContainer}>
    <Avatar.Text label={name[0]} size={40} style={styles.avatar} />
    <List.Item title={name} titleStyle={styles.contactName} />
    <Text style={styles.stateText}>En camino</Text>
  </TouchableOpacity>
);

const DeliversScreen = ({ navigation }) => {
  const contacts = [
    { id: 1, name: 'Entrega 1' },
    { id: 2, name: 'Entrega 2' },
    { id: 3, name: 'Entrega 3' },
  ];

  const navigateTodelivers = (List) => {
    navigation.navigate('Chat', { List });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis entregas</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ContactItem
            name={item.name}
            onPress={() => navigateTodelivers(item)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  deliverItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    padding: 12,
  },
  avatar: {
    backgroundColor: '#FFC107',
    marginRight: 16,
  },
  contactName: {
    fontSize: 16,
    color: '#333333',
  },
  stateText: {
    marginLeft: 'auto', 
    color: '#009688', 

    fontWeight: 'bold', 
  },
});

export default DeliversScreen;