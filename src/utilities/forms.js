import React from 'react'

export const useForm = (initialValues, errorHandlers) => {
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

  const fields = fieldsState

  const errors = errorsState

  return {
    getField,
    setField,
    fields,
    errors
  }
}
