import { ReactNode } from 'react'
import styles from './style.module.scss'
type AuthLayoutProps = {
  children: ReactNode
}
function AuthLayout({ children }: AuthLayoutProps) {
  return <div className={styles.login}>{ children }</div>
}

export default AuthLayout
