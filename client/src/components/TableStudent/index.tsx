import { Pagination, Table, TableColumnsType } from 'antd'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import pen from '../../assets/icons/pen.svg'
import trash from '../../assets/icons/trash.svg'
import avt from '../../assets/images'
import { privateAdminRoutes } from '../../config/admin.routes'
import { student } from '../../types/student'
import styles from './style.module.scss'

type TableStudentProps = {
  dataSource: {
    limit: number
    page: number
    total_pages: number
    students: student[]
  }
}
function TableStudent({ dataSource }: TableStudentProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries([...searchParams])
  const columns: TableColumnsType<student> = [
    {
      title: '',
      dataIndex: 'avatar',
      render: (text, record) => {
        const avatarSrc = avt[record.avatar.replace('./assets/images/', '')]
        return (
          <img
            src={avatarSrc}
            alt={record.name}
            style={{ height: '55px', width: '65px', objectFit: 'cover', borderRadius: '8px' }}
          />
        )
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: 'Phone',
      dataIndex: 'phone'
    },
    {
      title: 'Enroll Number',
      dataIndex: 'enrollNumber'
    },
    {
      title: 'Date Of Admission',
      dataIndex: 'dateOfAdmission'
    },
    {
      title: '',
      dataIndex: 'actions',
      render: () => (
        <div style={{ display: 'flex' }}>
          <img src={pen} style={{ marginRight: '33px', cursor: 'pointer' }} alt='Edit' onClick={() => {}} />
          <img src={trash} style={{ cursor: 'pointer' }} alt='Delete' onClick={() => {}} />
        </div>
      )
    }
  ]

  const onPaginationChange = (page: number) => {
    navigate({
      pathname: privateAdminRoutes.students,
      search: createSearchParams({
        ...params,
        page: String(page)
      }).toString()
    })
  }
  return (
    <div className={styles.tableStudent}>
      <Table
        columns={columns}
        dataSource={dataSource.students}
        pagination={false}
        showSorterTooltip={{ target: 'sorter-icon' }}
      />
      {dataSource.total_pages > 0 && (
        <Pagination
          onChange={onPaginationChange}
          className={styles.pagination}
          current={Number(dataSource.page) || 1}
          pageSize={dataSource.limit}
          total={dataSource.total_pages * dataSource.limit}
        />
      )}
    </div>
  )
}

export default TableStudent
