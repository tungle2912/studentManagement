import { Button, Form, Input, message } from 'antd'
import axios from '../../../api/axios'
import Tittle from '../../../common/Tittle'
import styles from './style.module.scss'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { SendOutlined } from '@ant-design/icons'

function Forgotpassword() {
  const [form] = Form.useForm()
  //const [loading, setLoading] = useState(false) // State để quản lý loading
  const [otpVisible, setOtpVisible] = useState(false) // State để quản lý việc hiển thị input OTP
  const [otp_id, setOtp_id] = useState('')
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false) // State để quản lý việc hiển thị input Reset Password
  const [buttonResetPasswordEnabled, setbuttonResetPasswordEnabled] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    message.error('Register failed. Please check your inputs.')
  }
  const sendOtp = async () => {
    try {
      const email = form.getFieldValue('email')
      form.resetFields(['otp'])
      const response = await axios.post('/users/send-otp-forgot-password', { email })
      console.log(response.data.result)
      setOtp_id(`${response.data.result}`)
      message.success('OTP has been sent to your email.')
      setOtpVisible(true) // Hiển thị input OTP sau khi gửi thành công
    } catch (error) {
      message.error('Failed to send OTP. Please try again.')
    }
  }
  const verifyOtp = async () => {
    try {
      const otp = form.getFieldValue('otp')
      console.log(otp_id)
      await axios.post('/users/verify-otp-forgot-password', { otp_id, otp })
      message.success('OTP verified successfully.')
      setResetPasswordVisible(true) // Hiển thị input Reset Password sau khi OTP được xác minh thành công
      setOtpVisible(false) // Ẩn input
      setbuttonResetPasswordEnabled(false)
      // Bạn có thể thêm logic xử lý sau khi OTP được xác minh thành công ở đây
    } catch (error) {
      message.error('Failed to verify OTP. Please try again.')
    }
  }
  const resetPassword = async () => {
    try {
      const values = form.getFieldsValue()
      const response = await axios.put('/users/reset-password', { otp_id, ...values })
      message.success(response.data.message)
      // Bạn có thể thêm logic xử lý sau khi Reset Password thành công ở đây
    } catch (error) {
      message.error('Failed to reset password. Please try again.')
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginFormHeader}>
          <Tittle className={styles.loginFormTittle} text='CURD OPERATION' />
          <h3 className={styles.loginSignIn}>FORGOT PASSWORD</h3>
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
          onFinish={resetPassword}
          onFinishFailed={onFinishFailed}
        >
          <div className={styles.inputEmail}>
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
            <Button onClick={sendOtp} className={styles.buttonSendOtp} icon={<SendOutlined />}></Button>
          </div>
          {otpVisible && (
            <Form.Item name='otp'>
              <Input.OTP
                onChange={verifyOtp}
                size='large'
                className={styles.inputOtp}
                formatter={(str) => str.toUpperCase()}
              />
            </Form.Item>
          )}
          {resetPasswordVisible && (
            <div>
              <Form.Item
                label='Password'
                className={styles.inputPassword}
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
                className={styles.inputPassword}
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
            </div>
          )}
          <Form.Item>
            <Button
              disabled={buttonResetPasswordEnabled}
              className={styles.loginFormButton}
              type='primary'
              htmlType='submit'
            >
              Reset Password
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

export default Forgotpassword
