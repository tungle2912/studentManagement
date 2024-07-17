import { Button, Form, Input, message } from 'antd'
import axios from '../../../api/axios'
import Tittle from '../../../common/Tittle'
import styles from './style.module.scss'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

function Register() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false) // State để quản lý loading

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    setLoading(true) // Bắt đầu hiển thị loading khi submit
    try {
      const response = await axios.post('/users/register', values)
      console.log(response)
      const msg = response.data.result.message
      if (msg) {
        message.success(msg)
      }
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.errors?.email?.msg || ''
      if (errorMessage != '') {
        form.setFields([
          {
            name: 'email',
            errors: [errorMessage]
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
    message.error('Register failed. Please check your inputs.')
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
          <Form.Item
            label='Email'
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
          <Form.Item
            label='Password'
            className={styles.loginFormInput}
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!'
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,50}$/,
                message: 'Password must be minimum 8 characters, at least one letter and one number!'
              }
            ]}
          >
            <Input type='password' placeholder='Enter your password' autoComplete='new-password' />
          </Form.Item>
          <Form.Item
            label='Confirm Password'
            className={styles.loginFormInput}
            name='confirm_password'
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'))
                }
              })
            ]}
          >
            <Input type='password' placeholder='Confirm your password' autoComplete='new-password' />
          </Form.Item>
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
