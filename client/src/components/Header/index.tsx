import { LeftCircleOutlined } from '@ant-design/icons'
import iconBell from '../../assets/icons/Bell.svg'

import styles from './style.module.scss'

import Search, { SearchProps } from 'antd/es/input/Search'
// type Props = {
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
// }
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)
function Header() {
  // const { setIsOpen } = props
  // const onToggleNavBar = () => {
  //   setIsOpen((prev: boolean) => !prev)
  // }
  return (
    <div className={styles.header}>
      <div>
        <LeftCircleOutlined className={styles.headerIconBack} />
      </div>
      <div className={styles.headerSearch}>
        <Search className={styles.search} placeholder='Search...' onSearch={onSearch} />
        <img className={styles.headerIconNotification} src={iconBell} alt='' />
      </div>
    </div>
  )
}

export default Header
