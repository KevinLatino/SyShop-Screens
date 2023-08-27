export const formatBase64String = (rawString) => {
  const string = `data:image/jpeg;base64,${rawString}`

  return string
}
