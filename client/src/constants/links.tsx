import { privateAdminRoutes } from '../config/admin.routes'
import { icons } from '../assets/icons'

type navLink = {
  id: number
  icon?: string
  label: string
  to: string
}
export const navLinks: navLink[] = [
  {
    id: 1,
    label: 'Home',
    to: privateAdminRoutes.dashboard,
    icon: icons.home
  },
  {
    id: 2,
    label: 'Course',
    to: privateAdminRoutes.course,
    icon: icons.course
  },
  {
    id: 3,
    label: 'Students',
    to: privateAdminRoutes.students,
    icon: icons.students
  },
  {
    id: 4,
    label: 'Payment',
    to: privateAdminRoutes.payment,
    icon: icons.payment
  },
  {
    id: 5,
    label: 'Report',
    to: privateAdminRoutes.report,
    icon: icons.report
  },
  {
    id: 6,
    label: 'Settings',
    to: privateAdminRoutes.settings,
    icon: icons.settings
  }
]
