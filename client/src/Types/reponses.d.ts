import { student } from './student'
import { user } from './users'

export interface Response<TData> {
  message: string
  result: TData
}

export interface ErrorResponse<TData> {
  message: string
  data?: TData
}

export type RefreshTokenResponse = Response<{
  access_token: string
}>

export type AuthResponse = Response<{
  refresh_token: string
  access_token: string
  user: user
}>
export type GetAllStudentResponse = Response<{
  limit: number
  page: number
  total_pages: number
  students: student[]
}>
