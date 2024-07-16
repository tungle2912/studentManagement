import StudentHeader from '../../../components/StudentHeader'
//import TablePayment from '../../components/TablePayment'
import styles from './style.module.scss'
import { listPayments } from '../../../constants/listPayments'
import { Table, TableColumnsType, TableProps } from 'antd'
import eye from '../../../assets/icons/eye.svg'
interface DataType {
  id: React.Key
  name: string
  paymentSchedule: string
  billNumber: string
  amountPaid: string
  balanceAmount: string
  date: string
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ['descend']
  },
  {
    title: 'Payment Schdule',
    dataIndex: 'paymentSchedule'
  },
  {
    title: 'Bill Number',
    dataIndex: 'billNumber',
    sorter: (a, b) => Number(a.billNumber) - Number(b.billNumber),
    sortDirections: ['descend']
  },
  {
    title: 'Amount Paid',
    dataIndex: 'amountPaid'
  },
  {
    title: 'Balance Amount',
    dataIndex: 'balanceAmount'
  },
  {
    title: '',
    dataIndex: 'actions',
    render: () => (
      <div>
        <img src={eye} />
      </div>
    )
  }
]

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}

function Payment() {
  return (
    <div className={styles.paymentContainer}>
      <StudentHeader classButoon={styles.button} className={styles.header} text='Payment Details'></StudentHeader>
      <div className={styles.tablePayment}>
        <Table
          columns={columns}
          dataSource={listPayments}
          onChange={onChange}
          pagination={{ pageSize: 4 }}
          showSorterTooltip={{ target: 'sorter-icon' }}
        />
        {/* <TablePayment payments={listPayments}></TablePayment> */}
      </div>
    </div>
  )
}

export default Payment
