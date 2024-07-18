import { Button, Form, message } from 'antd'
import Input from '../../../components/Input'
import axios from '../../../api/axios'
import Tittle from '../../../common/Tittle'
import styles from './style.module.scss'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SendOutlined } from '@ant-design/icons'
import { InputOTP } from 'antd-input-otp'
import { rules } from '../../../lib/rules'

function Forgotpassword() {
  const [form] = Form.useForm()
  const navigate = useNavigate() // Thêm useNavigate
  const [loading, setLoading] = useState(false) // State để quản lý loading
  const [otpVisible, setOtpVisible] = useState(false) // State để quản lý việc hiển thị input OTP
  const [otp_id, setOtp_id] = useState('')
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false) // State để quản lý việc hiển thị input Reset Password
  const [buttonResetPasswordEnabled, setbuttonResetPasswordEnabled] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const sendOtp = async () => {
    try {
      setLoading(true)
      const email = form.getFieldValue('email')
      form.resetFields(['otp'])
      const response = await axios.post('/users/send-otp-forgot-password', { email })
      console.log(response.data.result)
      setOtp_id(`${response.data.result}`)
      message.success('OTP has been sent to your email.')
      setOtpVisible(true) // Hiển thị input OTP sau khi gửi thành công
      setLoading(false)
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
  const verifyOtp = async () => {
    try {
      const otpArray = form.getFieldValue('otp')
      const otp = otpArray.join('')
      const response = await axios.post('/users/verify-otp-forgot-password', { otp_id, otp })
      message.success(response?.data?.message || 'OTP verified successfully.')
      setResetPasswordVisible(true) // Hiển thị input Reset Password sau khi OTP được xác minh thành công
      setOtpVisible(false) // Ẩn input
      setbuttonResetPasswordEnabled(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorOtpMessage = error.response?.data?.errors?.otp?.msg
      if (errorOtpMessage != '') {
        form.setFields([
          {
            name: 'otp',
            errors: [errorOtpMessage]
          }
        ])
      }
    }
  }
  const resetPassword = async () => {
    try {
      const values = form.getFieldsValue()
      const response = await axios.put('/users/reset-password', { otp_id, ...values })
      message.success(response?.data?.message)
      navigate('/login')
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
            <Input name='email' label='Email' placeholder='Enter your email' rules={rules.email} />
            <Button
              onClick={sendOtp}
              loading={loading}
              className={styles.buttonSendOtp}
              icon={<SendOutlined />}
            ></Button>
          </div>
          {otpVisible && (
            <Form.Item name='otp'>
              <InputOTP inputType='numeric-symbol' autoSubmit={verifyOtp} size='large' />
            </Form.Item>
          )}
          {resetPasswordVisible && (
            <div style={{ width: '100%' }}>
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
            </div>
          )}
          <div className={styles.buttonResetPassword}>
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
          </div>
        </Form>
        <NavLink to='/login' className={styles.loginFormContentReset}>
          Sign in
        </NavLink>
      </div>
    </div>
  )
}

export default Forgotpassword
