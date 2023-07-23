import { useState } from 'react'

export default () => {
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
