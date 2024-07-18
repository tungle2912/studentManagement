import { Rule } from 'antd/es/form'

export const rules: Record<'email' | 'password' | 'confirm_password', Rule[]> = {
  email: [
    {
      required: true,
      whitespace: true,
      message: 'Please input your Email!'
    },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'The input is not valid E-mail!'
    }
  ],
  password: [
    {
      required: true,
      message: 'Please input your Password!'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,50}$/,
      message: 'Password must be minimum 8 characters, at least one letter and one number!'
    }
  ],
  confirm_password: [
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
  ]
}
