export const publicAdminRoutes = {
  login: '/admin/login'
} as const

export const privateAdminRoutes = {
  dashboard: '/admin',
  payment: '/admin/payment',
  students: '/admin/students',
  addstudent: '/admin/students/add',
  editStudent: '/admin/students/edit/:id',
  course: '/admin/course',
  settings: '/admin/settings',
  report: '/admin/report'
} as const
