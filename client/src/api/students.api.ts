import { GetAllStudentResponse } from '../types/reponses'
import { student } from '../types/student'
import request from './axios'

const studentsApi = {
  getAllStudent: ({ page, limit }: { page?: number; limit?: number }) => {
    return request.get<GetAllStudentResponse>('/api/admin/students', {
      params: {
        page: page || 1,
        limit: limit || 6
      }
    })
  },
  getStudentById: (studentId: string) => {
    return request.get(`/api/admin/students/${studentId}`)
  },
  editStudent: ({ studentId, data }: { studentId: string; data: student }) => {
    return request.put(`/api/admin/students/${studentId}`, data)
  },
  addStudent: (data: student) => {
    return request.post('/api/admin/students', data)
  },
  deleteStudent: (studentId: string) => {
    return request.delete(`/api/admin/students/${studentId}`)
  }
}
export default studentsApi
