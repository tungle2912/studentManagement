import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth.api'
import { setAccessTokenToLocalCookie, setRefreshTokenToCookie, setRoleToLocalCookie } from '../../lib/utils'
import useAuth from '../useAuth'

export const useLoginMutation = () => {
  const { setIsAuthenticated } = useAuth()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const { access_token, refresh_token, role } = data?.data?.result ?? {}
      setRefreshTokenToCookie(refresh_token)
      setAccessTokenToLocalCookie(access_token)
      setRoleToLocalCookie(role)
      setIsAuthenticated(true)
    },
    onError: () => {}
  })
}
export const useRegisterMutation = () => {
  return useMutation({ mutationFn: authApi.register })
}
export const useLogoutMutation = () => {
  return useMutation({ mutationFn: authApi.logout })
}
export const useEmailVerifyMutation = () => {
  return useMutation({ mutationFn: authApi.emailVerify })
}
export const useSendOtpForgotPasswordMutation = () => {
  return useMutation({ mutationFn: authApi.sendOtpForgotPassword })
}
export const useVerifyOtpForgotPasswordMutation = () => {
  return useMutation({ mutationFn: authApi.verifyOtpForgotPassword })
}
export const useResetPasswordMutation = () => {
  return useMutation({ mutationFn: authApi.resetPassword })
}
