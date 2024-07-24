import studentsApi from '../../api/students.api'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetAllStudentResponse, GetStudentByIdResponse } from '../../types/reponses'
import { AxiosResponse } from 'axios'

export const useGetAllStudentQuery = ({
  enabled = true,
  page,
  limit
}: {
  page?: number
  limit?: number
  enabled?: boolean
}) => {
  return useQuery<AxiosResponse<GetAllStudentResponse, Error>>({
    queryKey: ['students', { page, limit }],
    queryFn: () => studentsApi.getAllStudent({ page, limit }),
    enabled: enabled,
    placeholderData: keepPreviousData
  })
}
export const useGetStudentByIdQuery = ({ enabled = true, studentId }: { enabled?: boolean; studentId: string }) => {
  return useQuery<AxiosResponse<GetStudentByIdResponse, Error>>({
    queryKey: ['student', studentId],
    queryFn: () => studentsApi.getStudentById(studentId),
    enabled
  })
}
export const useAddStudentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: studentsApi.addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    }
  })
}
export const useEditStudentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: studentsApi.editStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    }
  })
}
export const useDeleteStudentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    }
  })
}
