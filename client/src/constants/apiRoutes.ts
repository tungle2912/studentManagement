const API_BASE_URL = '/api'

export const AUTH_ROUTES = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  SEND_OTP_FORGOT_PASSWORD: `${API_BASE_URL}/auth/send-otp-forgot-password`,
  VERIFY_OTP_FORGOT_PASSWORD: `${API_BASE_URL}/auth/verify-otp-forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  LOGOUT: `${API_BASE_URL}/auth/logout`
}

export const ADMIN_ROUTES = {
  DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  ADD_STUDENT: `${API_BASE_URL}/admin/student/add`,
  EDIT_STUDENT: `${API_BASE_URL}/admin/student/edit/`,
  GET_ALL_STUDENTS: `${API_BASE_URL}/admin/students/`,
  GET_STUDENT_BY_ID: `${API_BASE_URL}/admin/student/`,
  DELETE_USER: `${API_BASE_URL}/admin/delete-user`
}

export const USER_ROUTES = {
  PROFILE: `${API_BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/update-profile`
}
