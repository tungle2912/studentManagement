/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOutlined } from '@ant-design/icons'
import { Button, Form, message } from 'antd'
import { InputOTP } from 'antd-input-otp'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Tittle from '../../../common/Tittle'
import Input from '../../../components/Input'
import {
  resetPasswordValues,
  sendOtpForgotPasswordValues,
  verifyOtpForgotPasswordValues
} from '../../../constants/enums'
import {
  useResetPasswordMutation,
  useSendOtpForgotPasswordMutation,
  useVerifyOtpForgotPasswordMutation
} from '../../../hooks/data/auth.data'
import { rules } from '../../../lib/rules'
import styles from './style.module.scss'

function Forgotpassword() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [otpVisible, setOtpVisible] = useState(false)
  const [otp_id, setOtp_id] = useState('')
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false)
  const [buttonResetPasswordEnabled, setButtonResetPasswordEnabled] = useState(true)
  const sendOtpMutation = useSendOtpForgotPasswordMutation()
  const verifyOtpMutation = useVerifyOtpForgotPasswordMutation()
  const resetPasswordMutation = useResetPasswordMutation()
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  // const sendOtpMutation = useMutation({
  //   mutationFn: async (email: string) => {
  //     const response = await axios.post(AUTH_ROUTES.SEND_OTP_FORGOT_PASSWORD, { email })
  //     return response.data.result
  //   },
  //   onSuccess: (result) => {
  //     setOtp_id(`${result}`)
  //     message.success('OTP has been sent to your email.')
  //     setOtpVisible(true)
  //   },
  //   onError: (error: APIResponse) => {
  //     const errorEmailMessage = error.response?.data?.errors?.email?.msg
  //     if (errorEmailMessage) {
  //       form.setFields([
  //         {
  //           name: 'email',
  //           errors: [errorEmailMessage]
  //         }
  //       ])
  //     }
  //   }
  // })
  // const verifyOtpMutation = useMutation({
  //   mutationFn: async ({ otp_id, otp }: { otp_id: string; otp: string }) => {
  //     const response = await axios.post(AUTH_ROUTES.VERIFY_OTP_FORGOT_PASSWORD, { otp_id, otp })
  //     return response.data
  //   },
  //   onSuccess: (data) => {
  //     message.success(data?.message || 'OTP verified successfully.')
  //     setResetPasswordVisible(true)
  //     setOtpVisible(false)
  //     setButtonResetPasswordEnabled(false)
  //   },
  //   onError: (error: APIResponse) => {
  //     const errorOtpMessage = error.response?.data?.errors?.otp?.msg
  //     if (errorOtpMessage) {
  //       form.setFields([
  //         {
  //           name: 'otp',
  //           errors: [errorOtpMessage]
  //         }
  //       ])
  //     }
  //   }
  // })
  // const resetPasswordMutation = useMutation({
  //   mutationFn: async (values: forgotPasswordValues) => {
  //     values.otp_id = otp_id
  //     const response = await axios.put(AUTH_ROUTES.RESET_PASSWORD, values)
  //     return response.data
  //   },
  //   onSuccess: (data) => {
  //     message.success(data?.message || 'Password reset successful.')
  //     navigate('/login')
  //   },
  //   onError: () => {
  //     message.error('Failed to reset password. Please try again.')
  //   }
  // })

  const dandleSendOtp = async (values: sendOtpForgotPasswordValues) => {
    try {
      form.resetFields(['otp'])
      const response = await sendOtpMutation.mutateAsync(values)
      setOtp_id(`${response?.data?.result}`)
      message.success(`${response?.data?.message}`)
      setOtpVisible(true)
    } catch (error: any) {
      const errorEmailMessage = error.response?.data?.errors?.email?.msg
      if (errorEmailMessage) {
        form.setFields([
          {
            name: 'email',
            errors: [errorEmailMessage]
          }
        ])
      }
    }
  }

  const handleVerifyOtp = async (values: verifyOtpForgotPasswordValues) => {
    try {
      const response = await verifyOtpMutation.mutateAsync(values)
      message.success(response?.data?.message || 'OTP verified successfully.')
      setResetPasswordVisible(true)
      setOtpVisible(false)
      setButtonResetPasswordEnabled(false)
    } catch (error: any) {
      const errorOtpMessage = error.response?.data?.errors?.otp?.msg
      if (errorOtpMessage) {
        form.setFields([
          {
            name: 'otp',
            errors: [errorOtpMessage]
          }
        ])
      }
    }
  }

  const handleResetPassword = async (values: resetPasswordValues) => {
    try {
      values.otp_id = otp_id
      const response = await resetPasswordMutation.mutateAsync(values)
      message.success(response?.data?.message || 'Password reset successful.')
      navigate('/login')
    } catch (error: any) {
      message.error(error.response?.data?.errors?.message || 'Failed to reset password. Please try again.')
    }
  }
  const senOtp = () => {
    form.validateFields(['email']).then((values) => {
      dandleSendOtp(values)
    })
  }
  const verifyOtp = () => {
    const otpArr = form.getFieldValue('otp')
    const otp = otpArr.join('')
    const values: verifyOtpForgotPasswordValues = {
      otp: otp,
      otp_id: otp_id
    }
    handleVerifyOtp(values)
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
          onFinish={handleResetPassword}
          onFinishFailed={onFinishFailed}
        >
          <div className={styles.inputEmail}>
            <Input name='email' label='Email' placeholder='Enter your email' rules={rules.email} />
            <Button
              onClick={senOtp}
              loading={sendOtpMutation.isPending}
              className={styles.buttonSendOtp}
              icon={<SendOutlined />}
            />
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
                label='Confirm Password'
                placeholder='Confirm your password'
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
                loading={resetPasswordMutation.isPending}
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
