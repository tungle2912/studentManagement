import { ADMIN_ROUTES } from '../constants/apiRoutes'
import { GetAllStudentResponse, GetStudentByIdResponse } from '../types/reponses'
import request from './axios'

const studentsApi = {
  getAllStudent: ({
    page,
    limit,
    search,
    sortBy,
    sortOrder
  }: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: string
  }) => {
    return request.get<GetAllStudentResponse>('/api/admin/students', {
      params: {
        page: page || 1,
        limit: limit || 6,
        search: search || '',
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder || 'descend'
      }
    })
  },
  getStudentById: (studentId: string) => {
    return request.get<GetStudentByIdResponse>(`${ADMIN_ROUTES.GET_STUDENT_BY_ID}${studentId}`)
  },
  editStudent: ({ data, studentId }: { studentId: string; data: FormData }) => {
    return request.put(`${ADMIN_ROUTES.EDIT_STUDENT}${studentId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  addStudent: (values: FormData) => {
    return request.post(ADMIN_ROUTES.ADD_STUDENT, values, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  deleteStudent: (studentId: string) => {
    return request.delete(`/api/admin/student/delete/${studentId}`)
  }
}
export default studentsApi
