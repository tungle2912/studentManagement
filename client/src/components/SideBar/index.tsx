import styles from './style.module.scss'
import img from '../../assets/images/avt2.jpg'
import iconLogOut from '../../assets/icons/logout.svg'
import { NavLink } from 'react-router-dom'
import { navLinks } from '../../constants/links'
type Props = {
  className?: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function index(props: Props) {
  const { setIsOpen } = props
  const closeNavBar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
    window.addEventListener('resize', closeNavBar)
    // Dọn dẹp event listener khi component unmount
    return () => window.removeEventListener('resize', closeNavBar)
  }
  const sidebarContentClass = `${styles.sidebarContent} ${props.className}`
  return (
    <div className={sidebarContentClass}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarTittle}>CURD OPERATIONS</div>
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
              <NavLink onClick={closeNavBar} className={styles.navItem} to={to}>
                <img src={icon} alt='' />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
          {/* <NavItem text='Home'></NavItem>
          <NavItem text='Course'></NavItem>
          <NavItem text='Students'></NavItem>
          <NavItem text='Payment'></NavItem>
          <NavItem text='Report'></NavItem>
          <NavItem text='Settings'></NavItem> */}
        </ul>
        <div className={styles.sideBarBottom}>
          <div className={styles.profile}>
            <img className={styles.sidebarHeaderImg} src={img} alt='' />
            <div className={styles.profileInformation}>
              <span className={styles.sidebarUserName}>Karthi Madesh</span>
              <span className={styles.sidebarUserRole}>Admin</span>
            </div>
          </div>
          <NavLink to={'/login'} className={styles.logOut}>
            <span className={styles.logOutText}>Logout</span>
            <img className={styles.logOutIcon} src={iconLogOut} alt='' />
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default index
