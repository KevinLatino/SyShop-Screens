import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  postContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  postInfo: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  showCommentsButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  showCommentsButtonText: {
    color: '#800000',
    fontWeight: 'bold',
  },
  commentsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 3,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginBottom: 8,
  },
  commentContainer: {
    marginBottom: 8,
  },
  commenterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  commentText: {
    fontSize: 14,
    color: '#000000',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    paddingHorizontal: 16,
    width: '100%',
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
  },
  container2: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showFooter, setShowFooter] = useState(true);

  // Datos de ejemplo de la publicación
  const post = {
    title: 'Título de la publicación',
    description: 'Descripción de la publicación',
    price: '50000',
    date: '17 de julio de 2023',
    image: require('./chaya.jpg'), // Reemplaza con la ruta de tu imagen
  };

  const [commenterName, setCommenterName] = useState('Corogod');

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleAddComment = () => {
    if (comment.trim() !== '') {
      // Agrega el comentario al arreglo de comentarios
      const newComment = {
        commenterName,
        comment,
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const toggleShowComments = () => {
    setShowComments(!showComments);
    setShowFooter(!showComments); // Ocultar el footer al ver los comentarios
  };

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <Image source={post.image} style={styles.image} />
        <View style={styles.postInfo}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>
          <Text style={styles.details}>Precio: {post.price}</Text>
          <Text style={styles.details}>Fecha de publicación: {post.date}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={toggleShowComments} style={styles.showCommentsButton}>
        <Text style={styles.showCommentsButtonText}>
          {showComments ? 'Ocultar comentarios' : 'Ver comentarios'}
        </Text>
      </TouchableOpacity>
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


      {showComments && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comentarios</Text>
          <View style={styles.divider} />
          {comments.map((item, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.commenterName}>{item.commenterName}</Text>
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          ))}
        </View>
      )}

      {showComments && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Añade un comentario..."
            value={comment}
            onChangeText={handleCommentChange}
          />
          <Button
            title="Publicar"
            onPress={handleAddComment}
            color="#800000"
          />
        </View>
      )}


    </View>
  )
}
