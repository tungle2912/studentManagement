import { payment } from '../../types/payment'
import styles from './style.module.scss'
import eye from '../../assets/icons/eye.svg'
type Props = {
  payments: payment[]
}
function TablePayment({ payments }: Props) {
  return (
    <table className={styles.table}>
      <tr className={styles.headerRow}>
        <th>
          <span className={styles.headerCell}>Name</span>
        </th>
        <th>
          <span className={styles.headerCell}>Payment Schedule</span>
        </th>
        <th>
          <span className={styles.headerCell}>Bill Number</span>
        </th>
        <th>
          <span className={styles.headerCell}>Amount Paid</span>
        </th>
        <th>
          <span className={styles.headerCell}>Balance amount</span>
        </th>
        <th>
          <span className={styles.headerCell}>Date</span>
        </th>
        <th></th>
      </tr>

      {payments.map((payment) => (
        <tr key={payment.id} className={styles.paymentRow}>
          <td>
            <span className={styles.paymentRowItem}>{payment.name}</span>
          </td>
          <td>
            <span className={styles.paymentRowItem}>{payment.paymentSchedule}</span>
          </td>
          <td>
            <span className={styles.paymentRowItem}>{payment.billNumber}</span>
          </td>
          <td>
            <span className={styles.paymentRowItem}>{payment.amountPaid}</span>
          </td>
          <td>
            <span className={styles.paymentRowItem}>{payment.balanceAmount}</span>
          </td>
          <td>
            <span className={styles.paymentRowItem}>{payment.date}</span>
          </td>
          <td>
            <div className={styles.actionCell}>
              <img src={eye} alt='' />
            </div>
          </td>
        </tr>
      ))}
    </table>
  )
}
export default TablePayment
