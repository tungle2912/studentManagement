import Button from '../../common/Button'
import TittleContent from '../../common/TittleContent'
import sort from '../../assets/icons/sort.svg'
import styles from './style.module.scss'

interface Props {
  text: string
  className?: string
  classButoon?: string
}
function index({ text, className, classButoon }: Props) {
  const studentHeaderClass = `${styles.studentHeader} ${className}`
  return (
    <div className={studentHeaderClass}>
      <TittleContent text={text}></TittleContent>
      <div className={styles.studentHeaderRight}>
        <img className={styles.studentHeaderIcon} src={sort} alt='' />
        <Button className={classButoon} text='ADD NEW STUDENT'></Button>
        
      </div>
    </div>
  )
}

export default index
