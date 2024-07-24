import { AUTH_ROUTES } from '../constants/apiRoutes';
import { RoleType } from '../constants/enums';
import request from './axios';

export const authApi = {
  login: (values: { email: string; password: string; role?: RoleType }) => {
    return request.post(AUTH_ROUTES.LOGIN, values)
  },
  register: (values: { email: string; password: string; confirm_password: string }) => {
    return request.post(AUTH_ROUTES.REGISTER, values)
  },
  logout: () => {
    return request.post(AUTH_ROUTES.LOGOUT)
  },
  emailVerify: (values: { email_verify_token: string }) => {
    return request.post(AUTH_ROUTES.VERIFY_EMAIL, values)
  },
  sendOtpForgotPassword: (values: { email: string }) => {
    return request.post(AUTH_ROUTES.SEND_OTP_FORGOT_PASSWORD, values)
  },
  verifyOtpForgotPassword: (values: { otp_id: string; otp: string }) => {
    return request.post(AUTH_ROUTES.VERIFY_OTP_FORGOT_PASSWORD, values)
  },
  resetPassword: (values: { email: string; password: string; otp_id: string }) => {
    return request.put(AUTH_ROUTES.RESET_PASSWORD, values)
  }


}
