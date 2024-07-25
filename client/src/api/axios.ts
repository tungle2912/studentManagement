import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import {
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  isAxiosExpiredAccessTokenError,
  isAxiosUnauthorizedError,
  removeAuthFromCookie,
  setAccessTokenToLocalCookie,
  setRefreshTokenToCookie
} from '../lib/utils'
import { RefreshTokenResponse } from '../types/reponses'

class Request {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string | undefined> | null

  constructor() {
    this.accessToken = getAccessTokenFromCookie()
    this.refreshToken = getRefreshTokenFromCookie()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: 'http://localhost:4000',
      timeout: 10000
    })

    this.instance.interceptors.request.use(
      (config) => {
        this.accessToken = getAccessTokenFromCookie()
        this.refreshToken = getRefreshTokenFromCookie()

        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        // Handle auth here
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => {

        return response
      },
      (error: AxiosError) => {
        if (isAxiosUnauthorizedError(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          if (
            isAxiosExpiredAccessTokenError<{
              message: string
              name: string
            }>(error) &&
            url !== 'refresh-token'
          ) {
            this.refreshTokenRequest = this.refreshTokenRequest ? this.refreshTokenRequest : this.handleRefreshToken()
            return this.refreshTokenRequest
              .then(() => {
                // Tiếp tục request cũ
                return this.instance(config)
              })
              .catch((error) => {
                throw error
              })
              .finally(() => {
                setTimeout(() => {
                  this.refreshTokenRequest = null
                }, 10000)
              })
          }
        }
        // Handle logout here
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>('/api/auth/refresh-token', {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token, refresh_token } = res.data.result as { access_token: string; refresh_token: string; }
        console.log('refresh', access_token)
        this.accessToken = access_token
        setAccessTokenToLocalCookie(access_token)
        setRefreshTokenToCookie(refresh_token)
        return this.accessToken
      })
      .catch((error) => {
        removeAuthFromCookie()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const request = new Request().instance

export default request
