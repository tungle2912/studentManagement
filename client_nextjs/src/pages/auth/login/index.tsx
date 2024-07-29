import { Button, Form, message } from 'antd'
import { useRouter } from 'next/router'
import Tittle from '~/common/Tittle'
import Input from '~/components/Input'
import { privateAdminRoutes } from '~/config/admin.routes'
import { privateUserRoutes } from '~/config/users.routes'
import { LoginValues, RoleType } from '~/constants/enums'
import { useLoginMutation } from '~/hooks/data/auth.data'
import { rules } from '~/lib/rules'
import { setAccessTokenToLocalCookie, setRefreshTokenToCookie, setRoleToLocalCookie } from '~/lib/utils'
import { isAdminRoute } from '~/lib/utils'
import styles from '~/styles/login.module.scss'
import useAuth from '~/hooks/useAuth'
import Link from 'next/link'

function Login() {
  const [form] = Form.useForm()
  const router = useRouter()
  const { setIsAuthenticated } = useAuth()
  const isAdminLogin = isAdminRoute(router.pathname)

  const loginMutation = useLoginMutation()
  const handleLogin = async (values: LoginValues) => {
    let UrlNavigate = ''
    if (isAdminLogin) {
      values.role = RoleType.Admin
      UrlNavigate = privateAdminRoutes.dashboard
    } else {
      values.role = RoleType.User
      UrlNavigate = privateUserRoutes.home
    }
    await loginMutation.mutateAsync(values, {
      onSuccess(data) {
        const { access_token, refresh_token, role } = data?.data?.result ?? {}
        setRefreshTokenToCookie(refresh_token)
        setAccessTokenToLocalCookie(access_token)
        setRoleToLocalCookie(role)
        setIsAuthenticated(true)
        router.replace(UrlNavigate)
        message.success(data?.data?.message)
      },
      onError(error: any) {
        const errorEmailMessage = error?.response?.data?.errors?.email?.msg
        if (errorEmailMessage != '') {
          form.setFields([
            {
              name: 'email',
              errors: [errorEmailMessage]
            }
          ])
        }
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginFormHeader}>
          <Tittle className={styles.loginFormTittle} text='CRUD OPERATION' />
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
          onFinish={handleLogin}
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
            <Button
              className={styles.loginFormButton}
              type='primary'
              htmlType='submit'
              loading={loginMutation.isPending}
            >
              SIGN IN
            </Button>
          </Form.Item>
        </Form>
        {isAdminLogin ? (
          <div className={styles.loginFormContentDescription}>
            Forgot your password?
            <Link href='/forgotpassword' className={styles.loginFormContentReset}>
              Reset Password
            </Link>
          </div>
        ) : (
          <div className={styles.loginFormContentDescription}>
            <Link href='/forgotpassword' className={styles.loginFormContentReset}>
              <p>Forgot your password?</p>
            </Link>
            <Link href='/register' className={styles.loginFormContentReset}>
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

module.exports = Login
