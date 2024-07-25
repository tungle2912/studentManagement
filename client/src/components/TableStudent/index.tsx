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

type TableStudentProps = {
  dataSource: {
    limit: number
    page: number
    total_pages: number
    students: student[]
  }
}
function TableStudent({ dataSource }: TableStudentProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries([...searchParams])
  const deleteStudentMutation = useDeleteStudentMutation()

  const handleDeleteStudent = async ({ name, studentId }: { studentId: string; name: string }) => {
    try {
      await deleteStudentMutation.mutateAsync(studentId)
      message.success(`Delete student ${name} successfully`)

      // Check if we need to navigate to the previous page
      const currentPage = Number(params.page) || 1
      if (dataSource.students.length === 1 && currentPage > 1) {
        // Navigate to the previous page if there are no students left on the current page
        navigate({
          pathname: privateAdminRoutes.students,
          search: createSearchParams({
            ...params,
            page: String(currentPage - 1)
          }).toString()
        })
      } else {
        // Reload the current page
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
      render: (text, record) => {
        const avatarSrc = `http://localhost:4000/admin/students/${record.avatar}`
        console.log(avatarSrc)
        return (
          <Image src={avatarSrc} style={{ height: '55px', width: '65px', objectFit: 'cover', borderRadius: '8px' }} />
        )
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      defaultSortOrder: 'descend'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      defaultSortOrder: 'descend',
      sorter: true
    },
    {
      title: 'Phone',
      dataIndex: 'phone'
    },
    {
      title: 'Enroll Number',
      dataIndex: 'enroll_number'
    },
    {
      title: 'Date Of Admission',
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
            {' '}
            <img src={trash} style={{ cursor: 'pointer' }} alt='Delete' />
          </Popconfirm>
        </div>
      )
    }
  ]
  // const onPaginationChange = (page: number) => {
  //   navigate({
  //     pathname: privateAdminRoutes.students,
  //     search: createSearchParams({
  //       ...params,
  //       page: String(page)
  //     }).toString()
  //   })
  // }
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
