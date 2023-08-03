import { useState, useEffect } from 'react'
import axios from 'axios'

export class RequestError extends Error {
  constructor(message) {
    super(message)

    this.message = message
  }
}

export const requestServer = async (endpoint, payload) => {
  const url = `http://localhost:8000${endpoint}`

  const { data, statusText } = await axios.post(url, payload)

  if (statusText !== "OK") {
    throw RequestError("Response status was not OK")
  }

  return data
}

export const useQuery = (queryCallback) => {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const refresh = () => {
    queryCallback()
      .then((callbackResult) => setResult(callbackResult))
      .catch((callbackError) => setError(callbackError))

    setResult(null)
    setError(null)
  }

  useEffect(() => {
    queryCallback()
      .then((callbackResult) => setResult(callbackResult))
      .catch((callbackError) => setError(callbackError))
  }, [])

  return {
    refresh,
    result,
    error
  }
}

export const useMutation = (mutationCallback) => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const execute = () => {
    mutationCallback()
      .then((callbackResult) => {
        setIsLoading(false)
        setResult(callbackResult)
      })
      .catch((callbackError) => setError(callbackError))

    setIsLoading(true)
    setResult(null)
    setError(null)
  }

  return {
    execute,
    isLoading,
    result,
    error
  }
}
