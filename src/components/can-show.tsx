import { ReactNode } from 'react'

interface CanShowProps {
  children: ReactNode
  isShowing: boolean
}

export function CanShow({ children, isShowing }: CanShowProps) {
  if (isShowing) {
    return children
  } else {
    return null
  }
}
