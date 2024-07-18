import { Button, Checkbox, Form, message } from 'antd'
import Input from '../../../components/Input'
import axios from '../../../api/axios'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Tittle from '../../../common/Tittle'
import styles from './style.module.scss'
import { setAccessTokenToLocalCookie, setRefreshTokenToCookie } from '../../../lib/utils'
import { RoleType } from '../../../constants/enums'
import { rules } from '../../../lib/rules'

function Login() {
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate() // Thêm useNavigate
  const isAdminLogin = location.pathname === '/admin/login'
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
      const { access_token, refresh_token } = response.data.result
      setAccessTokenToLocalCookie(access_token)
      setRefreshTokenToCookie(refresh_token)
      message.success('Login successful!')
      console.log(values.remember)
      if (values.remember) {
        localStorage.setItem('Email', values.email)
        localStorage.setItem('Password', values.password)
      }
      const role = response.data.role
      if (role == RoleType.User) {
        navigate('/')
      } else {
        navigate('/admin')
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
          <Input name='email' label='Email' placeholder='Enter your email' rules={rules.email} />
          <Input
            type='password'
            name='password'
            label='Password'
            placeholder='Enter your password'
            rules={rules.password}
          />
          <Form.Item name='remember'>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
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
