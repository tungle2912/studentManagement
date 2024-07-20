import { NavLink } from 'react-router-dom'
import iconLogOut from '../../assets/icons/logout.svg'
import img from '../../assets/images/avt2.jpg'
import { navLinks } from '../../constants/links'
import { removeAuthFromCookie } from '../../lib/utils'
import styles from './style.module.scss'
import { publicAdminRoutes } from '../../config/admin.routes'
import { useEffect } from 'react'

type Props = {
  className?: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const handleLogout = async () => {
  try {
    // await axios.post('/api/logout') // Replace with your actual logout API endpoint
    removeAuthFromCookie()
    window.location.href = publicAdminRoutes.login
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

function Sidebar(props: Props) {
  const { setIsOpen } = props

  const closeNavBar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  window.addEventListener('resize', closeNavBar)
  // Clean up event listener when component unmounts
  useEffect(() => {
    return () => window.removeEventListener('resize', closeNavBar)
  }, [])

  const sidebarContentClass = `${styles.sidebarContent} ${props.className}`

  return (
    <div className={sidebarContentClass}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarTittle}>CRUD OPERATIONS</div>
        <div className={styles.sideberProfile}>
          <img className={styles.sidebarHeaderImg} src={img} alt='' />
          <span className={styles.sidebarUserName}>Karthi Madesh</span>
          <span className={styles.sidebarUserRole}>Admin</span>
        </div>
      </div>
      <div className={styles.navMenu}>
        <ul className={styles.navItems}>
          {navLinks.map(({ id, label, to, icon }) => (
            <li key={id}>
              <NavLink
                onClick={closeNavBar}
                className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem)}
                to={to}
                end
              >
                <img src={icon} alt='' />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.sideBarBottom}>
          <div className={styles.profile}>
            <img className={styles.sidebarHeaderImg} src={img} alt='' />
            <div className={styles.profileInformation}>
              <span className={styles.sidebarUserName}>Karthi Madesh</span>
              <span className={styles.sidebarUserRole}>Admin</span>
            </div>
          </div>
          <div onClick={handleLogout} className={styles.logOut}>
            <span className={styles.logOutText}>Logout</span>
            <img className={styles.logOutIcon} src={iconLogOut} alt='' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
