import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth.api'
export const useLoginMutation = () => {
  return useMutation({ mutationFn: authApi.login })
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
