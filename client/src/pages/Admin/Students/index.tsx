import { useTranslation } from 'react-i18next'
import StudentHeader from '../../../components/StudentHeader'
import TableStudent from '../../../components/TableStudent'
import { useGetAllStudentQuery } from '../../../hooks/data/students.data'
import useQueryParams from '../../../hooks/useQueryParams'
import styles from './style.module.scss'

function Students() {
  const { t } = useTranslation()
  const param = useQueryParams()
  const studentList = useGetAllStudentQuery(param)

  return (
    <div className={styles.studentContainer}>
      <StudentHeader text={t('tittles.students')}></StudentHeader>
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
