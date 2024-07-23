import { useContext } from 'react'
import { AppContext } from '../contexts/app.context'

function useAuth() {
  return useContext(AppContext)
}

export default useAuth
