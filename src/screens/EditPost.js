import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    //paddingTop: 16,
    backgroundColor: '#ffffff',
  },
  menu: {
    // marginTop:15,
    marginLeft:-16,
    width:414,
    height:65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#800000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    borderRadius: 75,
    overflow: 'hidden',
  },
  profileImage: {
    width: 150,
    height: 150,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  changePhotoButton: {
    backgroundColor: '#e4e4e4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  changePhotoButtonText: {
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  inputTitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
  },
  inputLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#800000',
  },
})

export default () => {
  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity>
          <Text style={styles.menuItem}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.menuItem}>Editar perfil</Text>
        <TouchableOpacity>
          <Text style={styles.menuItem}>Confirmar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://i.scdn.co/image/ab67616100005174ab0267e9c6188b34d1881440' }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.username}></Text>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoButtonText}>Editar foto</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputTitle}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Pepito"
            // Add necessary state and onChange handlers for updating name
          />
          <View style={styles.inputLine} />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputTitle}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Cruz"
            // Add necessary state and onChange handlers for updating bio
          />
          <View style={styles.inputLine} />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputTitle}>Descripción</Text>
          <TextInput
            style={styles.input}
            placeholder="Manco jeff"
            // Add necessary state and onChange handlers for updating website
          />
          <View style={styles.inputLine} />
        </View>
      </View>
    </View>
  )
}
