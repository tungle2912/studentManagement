
import { user } from './users'

export interface SuccessResponse<TData> {
  message: string
  data: TData
}

export interface ErrorResponse<TData> {
  message: string
  data?: TData
}

export type RefreshTokenResponse = SuccessResponse<{
  access_token: string
}>

export type AuthResponse = SuccessResponse<{
  refresh_token: string
  access_token: string
  user: user
}>
