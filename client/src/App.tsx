import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom'
import './App.css'
import { privateAdminRoutes, publicAdminRoutes } from './config/admin.routes'
import { privateUserRoutes, publicUserRoutes } from './config/users.routes'
import useAuth from './hooks/data/useAuth'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import { isAdminRoute } from './lib/utils'
import Course from './pages/Admin/course'
import Dashboard from './pages/Admin/dashboard'
import Forgotpassword from './pages/Admin/forgotpassword'
import Login from './pages/Admin/login'
import Payment from './pages/Admin/payment'
import Register from './pages/Admin/register'
import Report from './pages/Admin/report'
import Settings from './pages/Admin/settings'
import Students from './pages/Admin/students'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isAdmin = isAdminRoute(location.pathname)
  console.log('ProtectedRoute', isAuthenticated)
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={isAdmin ? publicAdminRoutes.login : publicUserRoutes.login}
      state={{ from: location }}
      replace={true}
    />
  )
}
function RejectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isAdmin = isAdminRoute(location.pathname)
  return isAuthenticated ? (
    <Navigate to={isAdmin ? privateAdminRoutes.dashboard : privateUserRoutes.home} />
  ) : (
    <Outlet />
  )
}

function App() {
  const elements = useRoutes([
    {
      path: privateAdminRoutes.dashboard,
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: (
            <MainLayout>
              <Dashboard />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.payment,
          element: (
            <MainLayout>
              <Payment />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.course,
          element: (
            <MainLayout>
              <Course />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.report,
          element: (
            <MainLayout>
              <Report />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.students,
          element: (
            <MainLayout>
              <Students />
            </MainLayout>
          )
        },
        {
          path: privateAdminRoutes.settings,
          element: (
            <MainLayout>
              <Settings />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: publicAdminRoutes.login,
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        }
      ]
    },
    {
      path: privateUserRoutes.home,
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <div>Home</div>
        }
      ]
    },
    {
      path: publicUserRoutes.login,
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        }
      ]
    },
    {
      path: publicUserRoutes.register,
      element: (
        <AuthLayout>
          <Register />
        </AuthLayout>
      )
    },
    {
      path: publicUserRoutes.forgotpassword,
      element: (
        <AuthLayout>
          <Forgotpassword />
        </AuthLayout>
      )
    }
  ])
  return <div>{elements}</div>
}

export default App
