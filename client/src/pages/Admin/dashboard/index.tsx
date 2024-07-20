import styles from './style.module.scss'
import DashBoardItem from '../../../components/DashBoardItem'


function Dashboard() {
  // Function to format number as currency
  const formatCurrency = (number: number) => {
    return `INR ${Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)}`
  }

  return (
    <div className={styles.homeContainer}>
      <DashBoardItem className={styles.student} text='Students' number={243}></DashBoardItem>
      <DashBoardItem className={styles.Course} text='Course' number={13}></DashBoardItem>
      <DashBoardItem className={styles.Payment} text='Payment' number={formatCurrency(556000)}></DashBoardItem>
      <DashBoardItem className={styles.Users} text='Users' number={3}></DashBoardItem>
    </div>
  )
}

export default Dashboard
