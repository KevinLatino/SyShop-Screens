import { useState, useEffect } from 'react'
import { Snackbar } from 'react-native-paper'

const makeMessageShower = (setMessage, setIsVisible) => {
  const messageShower = (message) => {
    setMessage(message)
    setIsVisible(true)
  }

  return messageShower
}

export let showMessage = null

export default () => {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    showMessage = makeMessageShower(setMessage, setIsVisible)
  }, [])

  return (
    <Snackbar
      visible={isVisible}
      onDismiss={() => setIsVisible(false)}
      action={{
        label: 'Ocultar',
        onPress: () => setIsVisible(true)
      }}
    >
      {message}
    </Snackbar>
  )
}
