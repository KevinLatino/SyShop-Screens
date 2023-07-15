import { useState, useEffect } from 'react'

export default ({ callback }) => {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const run = () => {
    callback()
      .then((callbackResult) => setResult(callbackResult))
      .catch((callbackError) => setError(callbackError))

    setResult(null)
    setError(null)
  }

  useEffect(() => {
    callback()
      .then((callbackResult) => setResult(callbackResult))
      .catch((callbackError) => setError(callbackError))
  }, [])

  return [run, result, error]
}
