import { privateRoutes } from '../pages/routes'
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
    to: privateRoutes.home,
    icon: icons.home
  },
  {
    id: 2,
    label: 'Course',
    to: privateRoutes.course,
    icon: icons.course
  },
  {
    id: 3,
    label: 'Students',
    to: privateRoutes.students,
    icon: icons.students
  },
  {
    id: 4,
    label: 'Payment',
    to: privateRoutes.payment,
    icon: icons.payment
  },
  {
    id: 5,
    label: 'Report',
    to: privateRoutes.report,
    icon: icons.report
  },
  {
    id: 6,
    label: 'Settings',
    to: privateRoutes.settings,
    icon: icons.settings
  }
]
