import { Image, message, Popconfirm, Table, TableColumnsType, TablePaginationConfig } from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import pen from '../../assets/icons/pen.svg'
import trash from '../../assets/icons/trash.svg'
import { privateAdminRoutes } from '../../config/admin.routes'
import { useDeleteStudentMutation } from '../../hooks/data/students.data'
import useQueryParams from '../../hooks/useQueryParams'
import { student } from '../../types/student'
import styles from './style.module.scss'
import { useTranslation } from 'react-i18next'

type TableStudentProps = {
  dataSource: {
    limit: number
    page: number
    total_pages: number
    students: student[]
  }
}
function TableStudent({ dataSource }: TableStudentProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries([...searchParams])
  const deleteStudentMutation = useDeleteStudentMutation()

  const handleDeleteStudent = async ({ name, studentId }: { studentId: string; name: string }) => {
    try {
      await deleteStudentMutation.mutateAsync(studentId)
      message.success(`Delete student ${name} successfully`)
      const currentPage = Number(params.page) || 1
      if (dataSource.students.length === 1 && currentPage > 1) {
        navigate({
          pathname: privateAdminRoutes.students,
          search: createSearchParams({
            ...params,
            page: String(currentPage - 1)
          }).toString()
        })
      } else {
        navigate({
          pathname: privateAdminRoutes.students,
          search: createSearchParams({
            ...params,
            page: String(currentPage)
          }).toString()
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columns: TableColumnsType<student> = [
    {
      title: '',
      dataIndex: 'avatar',
      render: (url) => {
      //  const avatarSrc = `http://localhost:4000/admin/students/${url}`
        return (
          <Image src={url} style={{ height: '55px', width: '65px', objectFit: 'cover', borderRadius: '8px' }} />
        )
      }
    },
    {
      title: t('titlesTable.name'),
      dataIndex: 'name',
      sorter: true,
      defaultSortOrder: 'descend'
    },
    {
      title: t('titlesTable.email'),
      dataIndex: 'email',
      defaultSortOrder: 'descend',
      sorter: true
    },
    {
      title: t('titlesTable.phone'),
      dataIndex: 'phone'
    },
    {
      title: t('titlesTable.enroll_number'),
      dataIndex: 'enroll_number'
    },
    {
      title: t('titlesTable.date_of_admission'),
      dataIndex: 'date_of_admission'
    },
    {
      title: '',
      dataIndex: '_id',
      render: (id, record) => (
        <div style={{ display: 'flex' }}>
          <img
            src={pen}
            style={{ marginRight: '33px', cursor: 'pointer' }}
            alt='Edit'
            onClick={() => navigate(`${privateAdminRoutes.students}/edit/${id}`)}
          />

          <Popconfirm
            title='Delete the task'
            placement='leftTop'
            description='Are you sure to delete this task?'
            onConfirm={() => handleDeleteStudent({ name: record.name, studentId: id })}
            onCancel={() => {}}
            okText='Yes'
            cancelText='No'
          >
            <img src={trash} style={{ cursor: 'pointer' }} alt='Delete' />
          </Popconfirm>
        </div>
      )
    }
  ]
  const { search } = useQueryParams()
  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>, // Không sử dụng filters
    sorter: SorterResult<student> | SorterResult<student>[]
  ) => {
    const newPage = pagination.current || 1
    const newLimit = pagination.pageSize || 10
    const newSortBy = Array.isArray(sorter) ? sorter[0]?.field : sorter.field
    const newSortOrder = Array.isArray(sorter) ? sorter[0]?.order : sorter.order
    const queryParams: { [key: string]: string } = {}
    if (newPage) {
      queryParams.page = String(newPage)
    }
    if (newLimit) {
      queryParams.limit = String(newLimit)
    }
    if (newSortBy) {
      queryParams.sortBy = String(newSortBy)
    }
    if (newSortOrder == 'ascend') {
      queryParams.sortOrder = String(newSortOrder)
    }
    if (search) {
      queryParams.search = String(search)
    }
    const query = new URLSearchParams(queryParams).toString()
    // Điều hướng đến URL mới
    navigate(`/admin/students?${query}`)
    // Xử lý sorting và pagination
  }
  return (
    <div className={styles.tableStudent}>
      <Table
        columns={columns}
        dataSource={dataSource.students}
        onChange={handleTableChange}
        showSorterTooltip={{ target: 'sorter-icon' }}
        pagination={{
          current: Number(dataSource.page) || 1,
          pageSize: dataSource.limit,
          total: dataSource.total_pages * dataSource.limit
        }}
      />
      {/* {dataSource.total_pages > 0 && (
        <Pagination
          onChange={onPaginationChange}
          className={styles.pagination}
          current={Number(dataSource.page) || 1}
          pageSize={dataSource.limit}
          total={dataSource.total_pages * dataSource.limit}
        />
      )} */}
    </div>
  )
}

export default TableStudent
