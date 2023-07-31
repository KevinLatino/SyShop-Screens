import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bannerContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  profileImageContainer: {
    position: 'absolute',
    top: 110,
    left: 30,
    borderWidth: 2,
    borderColor: '#800000',
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom:200,
  },
  profileImage: {
    width: 130,
    height: 130,
  },
  titleContainer: {

    marginLeft:300,

    marginTop: 16,
  },
  title: {
    fontSize: 20,
    color: '#888888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#800000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 16,
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
  container2: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default () => {
  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://lavisionweb.com/wp-content/uploads/2021/05/asi-es-el-cuerpazo-en-cuarentena-que-luce-chayanne-a-sus-51-anos.jpg' }}
          style={styles.bannerImage}
        />

        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F21%2F2019%2F07%2Fgettyimages-951621092.jpg&w=400&h=532&c=sc&poi=face&q=60' }}
            style={styles.profileImage}
          />
        </View>
      </View>

      <View style={styles.titleContainer}>
      </View>

      <View style={{ height: 30 }} />

      <View style={styles.buttonContainer}>

      <TouchableOpacity style={styles.button}>

    <Text style={styles.buttonText}>Contactar</Text>

    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>

    <Text style={styles.buttonText}>Editar Perfil</Text>

    </TouchableOpacity>
    </View>

    <View style={styles.formContainer}>
    <View style={styles.inputWrapper}>
    <Text style={styles.inputTitle}>Nombre</Text>
    <TextInput
    style={styles.input}
    placeholder="Elmer"
    />
    <View style={styles.inputLine} />
    </View>
    <View style={styles.inputWrapper}>
    <Text style={styles.inputTitle}>Descripcion</Text>
    <TextInput 
    style={styles.input}
    placeholder="Si"
    />
    <View style={styles.inputLine} />
    </View>
    <View style={styles.inputWrapper}>
    <Text style={styles.inputTitle}>Categoria</Text>
    <TextInput
    style={styles.input}
    placeholder="Venta de figuras"
    />
    <View style={styles.inputLine} />
    </View>
    </View>

      <View style={styles.container2}>
        <TouchableOpacity style={styles.iconContainer}>
          <FontAwesome name="home" size={24} color="#80000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer}>
          <FontAwesome name="home" size={24} color="#80000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer}>
          <FontAwesome name="home" size={24} color="#80000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer}>
          <FontAwesome name="home" size={24} color="#80000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer}>
          <FontAwesome name="home" size={24} color="#80000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
