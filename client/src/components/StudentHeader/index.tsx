import Button from '../../common/Button'
import TittleContent from '../../common/TittleContent'
import sort from '../../assets/icons/sort.svg'
import styles from './style.module.scss'
import { useNavigate } from 'react-router-dom'

interface Props {
  text: string
  className?: string
  classButoon?: string
}
function Index({ text, className, classButoon }: Props) {
  const navigate = useNavigate()
  const handleAddNewStudent = () => {
    console.log('Add new student')
    navigate('/admin/students/add')
  }
  const studentHeaderClass = `${styles.studentHeader} ${className}`
  return (
    <div className={studentHeaderClass}>
      <TittleContent text={text}></TittleContent>
      <div className={styles.studentHeaderRight}>
        <img className={styles.studentHeaderIcon} src={sort} alt='' />
        <Button onClick={handleAddNewStudent} className={classButoon} text='ADD NEW STUDENT'></Button>
      </div>
    </div>
  )
}

export default Index
