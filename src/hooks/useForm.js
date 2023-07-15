import React from 'react'

export default (initialValues, errorHandlers) => {
  const [fieldsState, setFieldsState] = React.useState(initialValues)
  const [errorsState, setErrorsState] = React.useState({})

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

  const fields = fieldsState

  return {
    getField,
    setField,
    getError,
    hasErrors,
    fields
  }
}
