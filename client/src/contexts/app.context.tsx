import { createContext, ReactNode, SetStateAction, useState } from 'react'
import { getRefreshTokenFromCookie, getRoleFromCookie } from '../lib/utils'

export interface IAppContext {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>
  resetAtuthentication: () => void
}
const initalState: IAppContext = {
  isAuthenticated: Boolean(getRefreshTokenFromCookie()),
  setIsAuthenticated: () => null,
  resetAtuthentication: () => {}
}
export const AppContext = createContext<IAppContext>(initalState)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const role = getRoleFromCookie()
    console.log('role', role)
    console.log('isAuthenticated', initalState.isAuthenticated)
    return (role === 1 || role === 0) && initalState.isAuthenticated
  })
  const resetAtuthentication = () => {
    setIsAuthenticated(false)
  }
  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, resetAtuthentication }}>
      {children}
    </AppContext.Provider>
  )
}
