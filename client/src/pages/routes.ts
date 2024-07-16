export const publicRoutes = {
  adminLogin: '/admin/login',
  home: '/',
  login: '/login',
  register: '/register'
} as const

export const privateRoutes = {
  home: '/admin/',
  dashboard: '/admin/dashboard',
  payment: '/admin/payment',
  students: '/admin/students',
  course: '/admin/course',
  settings: '/admin/settings',
  report: '/admin/report'
} as const
