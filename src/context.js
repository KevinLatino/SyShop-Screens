import { atomWithStorage } from 'jotai/utils'
// import AsyncStorage from '@react-native-async-storage/async-storage'

export const sessionAtom = atomWithStorage("session", null)
