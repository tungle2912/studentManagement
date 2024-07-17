export const publicAdminRoutes = {
  login: '/admin/login'
} as const

export const privateAdminRoutes = {
  home: '/admin/',
  dashboard: '/admin/dashboard',
  payment: '/admin/payment',
  students: '/admin/students',
  course: '/admin/course',
  settings: '/admin/settings',
  report: '/admin/report'
} as const
