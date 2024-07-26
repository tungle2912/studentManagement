import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import HTTP_RESPONSE_STATUS_CODES from '../constants/httpStatus'
import { ErrorResponse } from '../types/reponses'
import { message } from 'antd'

export const formatNumber = (number: number) => new Intl.NumberFormat().format(number)

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error)
}

export const isAxiosUnprocessableEntityError = <UnprocessableEntityError>(
  error: unknown
): error is AxiosError<UnprocessableEntityError> => {
  return (
    isAxiosError<UnprocessableEntityError>(error) &&
    error.response?.status === HTTP_RESPONSE_STATUS_CODES.UNPROCESSABLE_ENTITY
  )
}

export const isAxiosUnauthorizedError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isAxiosError<UnauthorizedError>(error) && error.response?.status === HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED
}

export const isAxiosExpiredAccessTokenError = <ExpiredAccessTokenError>(
  error: unknown
): error is AxiosError<ExpiredAccessTokenError> => {
  return isAxiosUnauthorizedError<
    ErrorResponse<{
      message: string
      name: string
    }>
  >(error)
}
export const setRoleToLocalCookie = (role: number) => {
  Cookies.set('role', role.toString(), { expires: 7 })
}
export const getRoleFromCookie = () => {
  const role = Cookies.get('role')
  return role ? +role : undefined
}

export const setAccessTokenToLocalCookie = (access_token: string) => {
  Cookies.set('access_token', access_token, {
    expires: 5 / 1440
  })
}

export const getAccessTokenFromCookie = () => {
  return Cookies.get('access_token') || ''
}

export const setRefreshTokenToCookie = (refresh_token: string) => {
  Cookies.set('refresh_token', refresh_token, {
    expires: 7
  })
}

export const getRefreshTokenFromCookie = () => {
  return Cookies.get('refresh_token') || ''
}

export const removeAuthFromCookie = () => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  Cookies.remove('role')
}
export const isAdminRoute = (pathname: string) => {
  return pathname.includes('/admin')
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (error: any) => {
  if (error?.response?.data?.message) {
    return message.error(error.response.data.message)
  } else if (error?.message) {
    return message.error(error.message)
  } else {
    return message.error('Something went wrong')
  }
}
