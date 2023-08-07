import { useState } from 'react'

export const useCounter = () => {
  const [value, setValue] = useState(0)

  const increment = () => {
    const newValue = value + 1

    setValue(newValue)
  }

  const decrement = () => {
    const newValue= value === 0 ? 0 : value - 1

    setValue(newValue)
  }

  return {
    value,
    increment,
    decrement
  }
}

export const useForm = (initialValues, errorHandlers) => {
  const [fieldsState, setFieldsState] = useState(initialValues)
  const [errorsState, setErrorsState] = useState({})

  const getField = (name) => fieldsState[name]

  const setField = (name) => {
    const errorHandler = errorHandlers[name]

    const setter = (value) => {
      const error = errorHandler(value)

      setFieldsState({
        ...fieldsState,
        [name]: value
      })

      setErrorsState({
        ...errorsState,
        [name]: error
      })
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
