import { useState } from 'react'

export default () => {
  const [integer, setInteger] = useState(0)

  const increase = () => {
    const newInteger = integer + 1

    setInteger(newInteger)
  }

  const decrease = () => {
    const newInteger = integer === 0 ? 0 : integer - 1

    setInteger(newInteger)
  }

  return [integer, increase, decrease]
}
