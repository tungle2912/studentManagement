import styles from './style.module.scss'
import pen from '../../assets/icons/pen.svg'
import trash from '../../assets/icons/trash.svg'
import { student } from '../../types/student'

type Props = {
  students: student[]
}

function TableStudent({ students }: Props) {
  return (
    <table className={styles.table}>
      <tr className={styles.headerRow}>
        <th></th>
        <th>
          <span className={styles.headerCell}>Name</span>
        </th>
        <th>
          <span className={styles.headerCell}>Email</span>
        </th>
        <th>
          <span className={styles.headerCell}>Phone</span>
        </th>
        <th>
          <span className={styles.headerCell}>Enroll Number</span>
        </th>
        <th>
          <span className={styles.headerCell}>Date of admission</span>
        </th>
        <th></th>
      </tr>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className={styles.studentRow}>
            <td>
              <div className={styles.avatarCell}>
                <img src={student.avatar} className={styles.avatar} alt='' />
              </div>
            </td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.phone}</td>
            <td>{student.enrollNumber}</td>
            <td>{student.dateOfAdmission}</td>
            <td>
              <div className={styles.actionCell}>
                <img src={pen} alt='Edit' />
                <img src={trash} alt='Delete' />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableStudent
