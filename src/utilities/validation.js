import validator from 'validator'

export const makeNotEmptyChecker = (errorMessage) => {
  const checker = (text) => {
    if (validator.isEmpty(text)) {
      return errorMessage
    }

    return null
  }

  return checker
}

export const checkEmail = (email) => {
  if (!validator.isEmail(email)) {
    return "Correo electrónico inválido"
  }

  return null
}
