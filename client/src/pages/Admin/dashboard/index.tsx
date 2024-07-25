import styles from './style.module.scss'
import DashBoardItem from '../../../components/DashBoardItem'
import { useTranslation } from 'react-i18next'

function Dashboard() {
  const { t } = useTranslation()
  // Function to format number as currency
  const formatCurrency = (number: number) => {
    return `INR ${Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)}`
  }

  return (
    <div className={styles.homeContainer}>
      <DashBoardItem className={styles.student} text={t('stats.Students')} number={243}></DashBoardItem>
      <DashBoardItem className={styles.Course} text={t('stats.Course')} number={13}></DashBoardItem>
      <DashBoardItem
        className={styles.Payment}
        text={t('stats.Payments')}
        number={formatCurrency(556000)}
      ></DashBoardItem>
      <DashBoardItem className={styles.Users} text={t('stats.Users')} number={3}></DashBoardItem>
    </div>
  )
}

export default Dashboard
