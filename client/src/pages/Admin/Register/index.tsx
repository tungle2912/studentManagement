import { Button, Form, message } from 'antd'
import Input from '../../../components/Input'
import axios from '../../../api/axios'
import Tittle from '../../../common/Tittle'
import styles from './style.module.scss'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { rules } from '../../../lib/rules'

function Register() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false) // State để quản lý loading

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    setLoading(true) // Bắt đầu hiển thị loading khi submit
    try {
      const response = await axios.post('/users/register', values)
      console.log(response)
      const msg = response.data.message
      if (msg) {
        message.success(msg)
      }
    } catch (error) {
      const errorEmailMessage = // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.errors?.email?.msg
      if (errorEmailMessage != '') {
        form.setFields([
          {
            name: 'email',
            errors: [errorEmailMessage]
          }
        ])
      } else {
        message.error('Register failed. Please check your inputs.')
      }
    } finally {
      setLoading(false) // Ẩn loading sau khi hoàn thành
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
          <Input
            type='password'
            name='confirm_password'
            label='confirm_password'
            placeholder='Enter your password'
            rules={rules.confirm_password}
          />
          <Form.Item>
            <Button className={styles.loginFormButton} type='primary' htmlType='submit' loading={loading}>
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
