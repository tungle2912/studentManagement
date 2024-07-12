import { routes } from '../pages/routes'
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
    to: routes.home,
    icon: icons.home
  },
  {
    id: 2,
    label: 'Course',
    to: routes.course,
    icon: icons.course
  },
  {
    id: 3,
    label: 'Students',
    to: routes.students,
    icon: icons.students
  },
  {
    id: 4,
    label: 'Payment',
    to: routes.payment,
    icon: icons.payment
  },
  {
    id: 5,
    label: 'Report',
    to: routes.report,
    icon: icons.report
  },
  {
    id: 6,
    label: 'Settings',
    to: routes.settings,
    icon: icons.settings
  }
]
