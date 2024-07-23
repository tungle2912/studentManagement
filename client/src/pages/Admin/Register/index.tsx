/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, message } from 'antd'
import { NavLink } from 'react-router-dom'
import Tittle from '../../../common/Tittle'
import Input from '../../../components/Input'
import { RegisterValues } from '../../../constants/enums'
import { useRegisterMutation } from '../../../hooks/data/auth.data'
import { rules } from '../../../lib/rules'
import styles from './style.module.scss'

function Register() {
  const [form] = Form.useForm()
  const registerMutation = useRegisterMutation()

  const handleRegister = async (values: RegisterValues) => {
    try {
      const response = await registerMutation.mutateAsync(values)
      message.success(response?.data?.message)
    } catch (error: any) {
      const errorEmailMessage = error.response?.data?.errors?.email?.msg
      if (errorEmailMessage) {
        form.setFields([
          {
            name: 'email',
            errors: [errorEmailMessage]
          }
        ])
      } else {
        message.error('Register failed. Please check your inputs.')
      }
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginFormHeader}>
          <Tittle className={styles.loginFormTittle} text='CURD OPERATION' />
          <span className={styles.loginSignIn}>REGISTER</span>
        </div>
        <Form
          layout='vertical'
          requiredMark={false}
          className={styles.loginFormContent}
          name='normal_login'
          form={form}
          initialValues={{
            remember: true
          }}
          onFinish={handleRegister}
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
          <Input
            type='password'
            name='confirm_password'
            label='Confirm Password'
            placeholder='Confirm your password'
            rules={rules.confirm_password}
          />
          <Form.Item>
            <Button
              className={styles.loginFormButton}
              type='primary'
              htmlType='submit'
              loading={registerMutation.isPending}
            >
              SIGN UP
            </Button>
          </Form.Item>
        </Form>
        <NavLink to='/login' className={styles.loginFormContentReset}>
          Sign in
        </NavLink>
      </div>
    </div>
  )
}

export default Register
