import StudentHeader from '../../../components/StudentHeader'
import TableStudent from '../../../components/TableStudent'
import { useGetAllStudentQuery } from '../../../hooks/data/students.data'
import useQueryParams from '../../../hooks/useQueryParams'
import styles from './style.module.scss'

function Students() {
  const { page, limit } = useQueryParams()
  const studentList = useGetAllStudentQuery({ page: page, limit: limit })
  return (
    <div className={styles.studentContainer}>
      <StudentHeader text='Students List'></StudentHeader>
      <TableStudent
        dataSource={
          studentList?.data?.data?.result || {
            page: 1,
            limit: 6,
            total_pages: 0,
            students: []
          }
        }
      />
    </div>
  )
}

export default Students
