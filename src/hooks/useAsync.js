import { useState, useEffect } from 'react'

export default ({ callback }) => {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const run = () => {
    callback()
      .then((callbackResult) => setResult(callbackResult))
      .catch((callbackError) => setError(callbackError))
  }

  useEffect(() => {
    run()
  }, [])

  return [run, result, error]
}
