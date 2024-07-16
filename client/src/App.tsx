import './App.css'
import { useRoutes } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './pages/routes'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Admin/Login'
import Home from './pages/Admin/Home'
import Payment from './pages/Admin/Payment'
import Students from './pages/Admin/Students'
import Settings from './pages/Admin/Settings'
import Report from './pages/Admin/Report'
import Course from './pages/Admin/Course'
import Register from './pages/Admin/Register'

function App() {
  const elements = useRoutes([
    {
      path: publicRoutes.login, // /login
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
    },
    {
      path: publicRoutes.adminLogin, // /login
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
    },
    {
      path: publicRoutes.register,
      element: (
        <AuthLayout>
          <Register />
        </AuthLayout>
      )
    },
    {
      path: privateRoutes.home,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: privateRoutes.payment,
      element: (
        <MainLayout>
          <Payment />
        </MainLayout>
      )
    },
    {
      path: privateRoutes.course,
      element: (
        <MainLayout>
          <Course />
        </MainLayout>
      )
    },
    {
      path: privateRoutes.report,
      element: (
        <MainLayout>
          <Report />
        </MainLayout>
      )
    },
    {
      path: privateRoutes.students,
      element: (
        <MainLayout>
          <Students />
        </MainLayout>
      )
    },
    {
      path: privateRoutes.settings,
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
