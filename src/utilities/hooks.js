import { useState } from 'react'

export const useForm = (initialValues, errorHandlers) => {
  const [fieldsState, setFieldsState] = useState(initialValues)
  const [errorsState, setErrorsState] = useState({})

  const getField = (name) => fieldsState[name]

  const setField = (name) => {
    const errorHandler = errorHandlers[name]

    const setter = (value) => {
      const error = errorHandler(value)

      setFieldsState(fs => ({
        ...fs,
        [name]: value
      }))

      setErrorsState(es => ({
        ...es,
        [name]: error
      }))
    }

    return setter
  }

  const getError = (name) => {
    return errorsState[name]
  }

  const hasErrors = () => {
    return Object.values(errorsState).some((v) => v !== null)
  }

  return {
    getField,
    setField,
    getError,
    hasErrors,
    fields: fieldsState
  }
}
