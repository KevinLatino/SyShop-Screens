import { QueryClient } from '@tanstack/react-query'
import { atomWithStorage } from 'jotai/utils'

export const queryClient = new QueryClient()
export const sessionAtom = atomWithStorage("session", null)
