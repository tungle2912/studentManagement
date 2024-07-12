import Header from '../../components/Header'
import SideBar from '../../components/SideBar'
import styles from './style.module.scss'
import { ReactNode, useEffect, useState } from 'react'

type MainLayoutProps = {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const onToggleNavBar = () => {
    setIsOpen((prev: boolean) => !prev)
  }
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }
    // Thêm event listener khi component mount
    window.addEventListener('resize', handleResize)
    // Dọn dẹp event listener khi component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const openNavClass = `${styles.openNav} ${isOpen ? styles.open : styles.close}`
  return (
    <div className={styles.container}>
      {isOpen && <SideBar setIsOpen={setIsOpen} />}
      <div className={styles.main_content}>
        <div className={styles.header}>
          <div className={openNavClass} onClick={onToggleNavBar}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Header />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
export default MainLayout
