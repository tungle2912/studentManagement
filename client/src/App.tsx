import './App.css'
import { useRoutes } from 'react-router-dom'
import { routes } from './pages/routes'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Home from './pages/Home'
import Payment from './pages/Payment'
import Students from './pages/Students'
import Settings from './pages/Settings'
import Report from './pages/Report'
import Course from './pages/Course'


function App() {
  const elements = useRoutes([
    {
      path: routes.home,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: routes.login,
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
    },
    {
      path: routes.Logout,
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
    },
    {
      path: routes.payment,
      element: (
        <MainLayout>
          <Payment />
        </MainLayout>
      )
    },
    {
      path: routes.course,
      element: (
        <MainLayout>
          <Course />
        </MainLayout>
      )
    },
    {
      path: routes.report,
      element: (
        <MainLayout>
          <Report />
        </MainLayout>
      )
    },
    {
      path: routes.students,
      element: (
        <MainLayout>
          <Students />
        </MainLayout>
      )
    },
    {
      path: routes.settings,
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
