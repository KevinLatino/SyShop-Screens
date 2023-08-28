export const formatBase64String = (rawString) => {
  const string = `data:image/jpeg;base64,${rawString}`

  return string
}

export const formatLocation = (location) => {
  const { place_name, street_address, city, state } = location
  const string = `${place_name}, ${street_address}, ${city}, ${state}`

  return string
}
