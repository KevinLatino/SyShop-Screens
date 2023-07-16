import { atomWithStorage } from 'jotai/utils'

export const sessionTokenAtom = atomWithStorage("sessionToken", null)
export const customerId = atomWithStorage("customerId", null)
