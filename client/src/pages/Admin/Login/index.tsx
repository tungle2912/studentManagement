import { Button, Form, Input, message } from 'antd'
import axios from '../../../api/axios'
import { NavLink, useLocation } from 'react-router-dom'
import Tittle from '../../../common/Tittle'
import styles from './style.module.scss'
import { setAccessTokenToLocalCookie, setRefreshTokenToCookie } from '../../../lib/utils'

function Login() {
  const [form] = Form.useForm()
  const location = useLocation()
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
      console.log(response)

      const { access_token, refresh_token } = response.data.result
      console.log(access_token, refresh_token)
      setAccessTokenToLocalCookie(access_token)
      setRefreshTokenToCookie(refresh_token)

      message.success('Login successful!')
    } catch (error) {
      message.error('Login failed. Please check your credentials.')
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    message.error('Login failed. Please check your inputs.')
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
          name='normal_login'
          form={form}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <label>Email</label>
          <Form.Item
            className={styles.loginFormInput}
            name='email'
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please input your Email!'
              },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'The input is not valid E-mail!'
              }
            ]}
          >
            <Input placeholder='Enter your email' autoComplete='email' />
          </Form.Item>
          <label>Password</label>
          <Form.Item
            className={styles.loginFormInput}
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!'
              },
              {
                pattern: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                message: 'Password must be minimum 8 characters, at least one letter and one number!'
              }
            ]}
          >
            <Input type='password' placeholder='Enter your password' autoComplete='password' />
          </Form.Item>
          <Form.Item>
            <Button className={styles.loginFormButton} type='primary' htmlType='submit'>
              SIGN IN
            </Button>
          </Form.Item>
        </Form>
        <p className={styles.loginFormContentDescription}>
          Forgot your password?
          {isAdminLogin ? (
            <NavLink to='/resetpassword' className={styles.loginFormContentReset}>
              Reset Password
            </NavLink>
          ) : (
            <NavLink to='/register' className={styles.loginFormContentReset}>
              Register
            </NavLink>
          )}
        </p>
      </div>
    </div>
  )
}

export default Login
