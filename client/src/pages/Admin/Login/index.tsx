import { Button, Form, message } from 'antd'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import axios from '../../../api/axios'
import Tittle from '../../../common/Tittle'
import Input from '../../../components/Input'
import { RoleType } from '../../../constants/enums'
import { rules } from '../../../lib/rules'
import {
  isAdminRoute,
  setAccessTokenToLocalCookie,
  setRefreshTokenToCookie,
  setRoleToLocalCookie
} from '../../../lib/utils'
import styles from './style.module.scss'
import useAuth from '../../../hooks/data/useAuth'

function Login() {
  const [form] = Form.useForm()
  const location = useLocation()
  const { setIsAuthenticated } = useAuth() // Thêm setIsAuthenticated
  const navigate = useNavigate() // Thêm useNavigate
  const isAdminLogin = isAdminRoute(location.pathname)
  const params = new URLSearchParams(window.location.search)
  const email = params.get('email')
  if (email) {
    form.setFieldsValue({ email })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    const url = isAdminLogin ? '/admin/login' : 'users/login'
    try {
      const response = await axios.post(url, values)
      const { access_token, refresh_token, role } = response.data.result
      setRefreshTokenToCookie(refresh_token)
      setAccessTokenToLocalCookie(access_token)
      setRoleToLocalCookie(role)
      setIsAuthenticated(true)
      message.success('Login successful!')
      if (role == RoleType.User) {
        console.log('navigate to /')
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        setTimeout(() => {
          console.log('navigate to /admin')
          navigate('/admin')
        }, 1000)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorEmailMessage = error.response?.data?.errors?.email?.msg
      if (errorEmailMessage != '') {
        form.setFields([
          {
            name: 'email',
            errors: [errorEmailMessage]
          }
        ])
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginFormHeader}>
          <Tittle className={styles.loginFormTittle} text='CURD OPERATION' />
          <span className={styles.loginSignIn}>SIGN IN</span>
          <p className={styles.loginDescription}>Enter your credentials to access your account</p>
          <button
            onClick={() => {
              navigate('/admin')
              console.log('navigate to /admin')
            }}
          >
            a
          </button>
        </div>
        <Form
          className={styles.loginFormContent}
          layout='vertical'
          requiredMark={false}
          name='normal_login'
          form={form}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Input
            name='email'
            autocomplete='username'
            label='Email'
            placeholder='Enter your email'
            rules={rules.email}
          />
          <Input
            type='password'
            name='password'
            label='Password'
            placeholder='Enter your password'
            autocomplete='current-password'
            rules={rules.password}
          />
          <Form.Item>
            <Button className={styles.loginFormButton} type='primary' htmlType='submit'>
              SIGN IN
            </Button>
          </Form.Item>
        </Form>
        {isAdminLogin ? (
          <div className={styles.loginFormContentDescription}>
            Forgot your password?
            <NavLink to='/forgotpassword' className={styles.loginFormContentReset}>
              Reset Password
            </NavLink>
          </div>
        ) : (
          <div className={styles.loginFormContentDescription}>
            <NavLink to='/forgotpassword' className={styles.loginFormContentReset}>
              <p>Forgot your password?</p>
            </NavLink>
            <NavLink to='/register' className={styles.loginFormContentReset}>
              Register
            </NavLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
