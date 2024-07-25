import { GlobalOutlined, LeftCircleOutlined } from '@ant-design/icons'
import iconBell from '../../assets/icons/Bell.svg'
import { Button, Dropdown, Menu } from 'antd'
import Search, { SearchProps } from 'antd/es/input/Search'
import { changeLanguage } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
import styles from './style.module.scss'
// type Props = {
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
// }
const menu = (
  <Menu>
    <Menu.Item key='vi' onClick={() => changeLanguage('vi')}>
      Vietnamese
    </Menu.Item>
    <Menu.Item key='en' onClick={() => changeLanguage('en')}>
      English
    </Menu.Item>
  </Menu>
)
function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { limit, sortBy, sortOrder } = useQueryParams()
  const onSearch: SearchProps['onSearch'] = (value) => {
    const queryParams: { [key: string]: string } = {}
    queryParams.page = '1'
    if (limit) queryParams.limit = String(limit)
    if (sortBy) queryParams.sortBy = sortBy
    if (sortOrder) queryParams.sortOrder = sortOrder
    if (value) queryParams.search = value
    const query = new URLSearchParams(queryParams).toString()
    navigate(`/admin/students?${query}`)
  }
  return (
    <div className={styles.header}>
      <div>
        <LeftCircleOutlined className={styles.headerIconBack} />
      </div>
      <div className={styles.headerSearch}>
        <Search className={styles.search} placeholder={t('inputs.search.placeholder')} onSearch={onSearch} />
        <img className={styles.headerIconNotification} src={iconBell} alt='' />
        <Dropdown className={styles.language} overlay={menu} trigger={['click']}>
          <Button icon={<GlobalOutlined />}>{t('language')}</Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default Header
