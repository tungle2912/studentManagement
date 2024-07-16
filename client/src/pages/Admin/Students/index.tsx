//import TableStudent from '../../components/TableStudent'
import StudentHeader from '../../../components/StudentHeader'
import listStudents from '../../../constants/listStudents'
import styles from './style.module.scss'
import pen from '../../../assets/icons/pen.svg'
import trash from '../../../assets/icons/trash.svg'

import { Table, TableColumnsType, TableProps } from 'antd'
interface DataType {
  id: React.Key
  name: string
  email: string
  phone: string
  enrollNumber: string
  dateOfAdmission: string
  avatar: string
}

const columns: TableColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'avatar',
    render: (text, record) => (
      <img
        src={record.avatar}
        alt={record.name}
        style={{ height: '55px', width: '65px', objectFit: 'cover', borderRadius: '8px' }}
      />
    )
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
        <img src={pen} style={{ marginRight: '33px' }} alt='Edit' />
        <img src={trash} alt='Delete' />
      </div>
    )
  }
]

// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park'
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park'
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park'
//   },
//   {
//     key: '4',
//     name: 'Jim Red',
//     age: 32,
//     address: 'London No. 2 Lake Park'
//   }
// ]

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}

function Students() {
  return (
    <div className={styles.studentContainer}>
      <StudentHeader text='Students List'></StudentHeader>
      <div className={styles.tableStudent}>
        <Table
          columns={columns}
          dataSource={listStudents}
          onChange={onChange}
          pagination={{ pageSize: 6 }}
          showSorterTooltip={{ target: 'sorter-icon' }}
        />
      </div>
    </div>
    /* <TableStudent students={listStudents}></TableStudent> */
  )
}
export default Students
