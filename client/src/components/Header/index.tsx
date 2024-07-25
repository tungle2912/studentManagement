import { LeftCircleOutlined } from '@ant-design/icons'
import iconBell from '../../assets/icons/Bell.svg'

import styles from './style.module.scss'

import Search, { SearchProps } from 'antd/es/input/Search'
import { useNavigate } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
// type Props = {
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
// }
function Header() {
  // const { setIsOpen } = props
  // const onToggleNavBar = () => {
  //   setIsOpen((prev: boolean) => !prev)
  // }
  const navigate = useNavigate()
  const { page, limit, sortBy, sortOrder } = useQueryParams()
  const onSearch: SearchProps['onSearch'] = (value) => {
    // Các tham số khác
    // Tạo URL với các tham số tìm kiếm
    const queryParams: { [key: string]: string } = {}

    // Thêm các tham số vào đối tượng chỉ nếu chúng có giá trị
    if (page) queryParams.page = String(page)
    if (limit) queryParams.limit = String(limit)
    if (sortBy) queryParams.sortBy = sortBy
    if (sortOrder) queryParams.sortOrder = sortOrder
    if (value) queryParams.search = value

    // Tạo chuỗi truy vấn từ đối tượng
    const query = new URLSearchParams(queryParams).toString()
    // Điều hướng đến URL mới
    navigate(`/admin/students?${query}`)
  }
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
