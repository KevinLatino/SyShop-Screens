// Este objeto almacena constantes importantes para la aplicación (claves y secrets)
// de servicios externos. Estas constantes, se pueden almacenar en un archivo
// del código fuente sin ningún riesgo ya que la aplicación se va a ejecutar en
// un dispositivo móvil. Entonces el usuario no tiene ninguna manera de acceder
// a estas constantes.

// De cualquier manera, no es aconsejable subirlas a algún repositorio público,
// lo ideal sería que cada autor mantenga una versión de este archivo en un
// su repositorio local, con sus propias credenciales de prueba, o bien producción.

// Atentamente, Gabriel Coronel

export default {
  API_URL: "https://chatty-memes-think.loca.lt",
  GOOGLE_ANDROID_CLIENT_ID: "866099398402-i5nivm53251u4nhpdqsqdjeh0rhjgkv1.apps.googleusercontent.com",
  GOOGLE_WEB_CLIENT_ID: "866099398402-m8bva75e4omfjuejibsdjq9kr1kj30t1.apps.googleusercontent.com",
  GOOGLE_EXPO_CLIENT_ID: "866099398402-1n80v70dk1d7cpdsm1ideuml8otjvv75.apps.googleusercontent.com",
  GEOAPIFY_API_KEY: "bebad2bf6d734de88ccc5cd65e3a63d0",
  STRIPE_PUBLISHABLE_KEY: "pk_test_51NPzJqAVu15J6ILXssR7dYO2d4abYHTdLMapQI5b23VWt7UYzlYu7ZYxewf8iAVQT7HnEYhv74HSYhNXsVJA6Ohy00OJkyO8WV"
}
