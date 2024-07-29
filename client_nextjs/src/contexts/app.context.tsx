import { createContext, ReactNode, SetStateAction, useState } from 'react'
import { getRefreshTokenFromCookie, getRoleFromCookie, isAdminRoute } from '../lib/utils'
import { RoleType } from '../constants/enums'

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
    const isAdmin = isAdminRoute(location.pathname) && role === RoleType.Admin
    const isUser = !isAdminRoute(location.pathname) && role === RoleType.User

    return (initalState.isAuthenticated && isAdmin) || (initalState.isAuthenticated && isUser)
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
