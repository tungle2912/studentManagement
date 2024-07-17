import './App.css'
import { useRoutes } from 'react-router-dom'
import { publicAdminRoutes, privateAdminRoutes } from './config/admin.routes'
import { publicUserRoutes } from './config/users.routes'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Admin/login'
import Home from './pages/Admin/home'
import Payment from './pages/Admin/payment'
import Students from './pages/Admin/students'
import Settings from './pages/Admin/settings'
import Report from './pages/Admin/report'
import Course from './pages/Admin/course'
import Register from './pages/Admin/register'
import Forgotpassword from './pages/Admin/forgotpassword'

function App() {
  const elements = useRoutes([
    {
      path: publicUserRoutes.login, // /login
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
    },
    {
      path: publicAdminRoutes.login, // /login
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
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
    },
    {
      path: privateAdminRoutes.home,
      element: (
        <MainLayout>
          <Home />
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
  ])
  return <div>{elements}</div>
}

export default App
