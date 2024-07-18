import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  LoginReqBody,
  RegisterReqBody,
  requestOTPReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  VerifyEmailReqBody,
  verifyOTPReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  const role = user.role
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result,
    role
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    await usersService.register(req.body)
    return res.json({
      message: USERS_MESSAGES.REGISTER_SUCCESS
    })
  } catch (error) {
    next(error)
  }
}
export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, exp } = req.decoded_email_verify_token as TokenPayload
    console.log(user_id, exp)
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
    let message
    let redirectUrl = `http://localhost:3000/login`
    if (!user) {
      message = USERS_MESSAGES.USER_NOT_FOUND
    } else {
      const currentTime = Math.floor(Date.now() / 1000)
      if (exp < currentTime) {
        // Token đã hết hạn
        await databaseService.users.deleteOne({
          _id: new ObjectId(user_id)
        })
        message = USERS_MESSAGES.EMAIL_VERIFY_TOKEN_EXPIRED
      } else if (user.email_verify_token === '') {
        message = USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
      } else {
        await usersService.verifyEmail(user_id)
        message = USERS_MESSAGES.EMAIL_VERIFY_SUCCESS
        redirectUrl = `http://localhost:3000/login?email=${encodeURIComponent(user.email)}`
      }
    }

    res.send(`
      <html>
        <body>
          <h2>${message}</h2>
          <script>
            setTimeout(() => {
              window.location.href = '${redirectUrl}';
            }, 3000); // Chuyển hướng sau 3 giây
          </script>
        </body>
      </html>
    `)
  } catch (error) {
    next(error)
  }
}
export const forgotPasswordController = {
  requestOTP: async (req: Request<ParamsDictionary, any, requestOTPReqBody>, res: Response, next: NextFunction) => {
    try {
      const email = req.body.email
      const result = await usersService.forgotPasswordService(email)
      res.status(200).json({ message: 'OTP sent to your email.', result })
    } catch (error) {
      next(error)
    }
  },
  verifyOTP: async (req: Request<ParamsDictionary, any, verifyOTPReqBody>, res: Response, next: NextFunction) => {
    try {
      const otp_id = req.body.otp_id as string
      await usersService.verifyOtp(otp_id)
      res.status(200).json({ message: 'verify OTP success' })
    } catch (error) {
      next(error)
    }
  },
  resetPassword: async (
    req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password, otp_id } = req.body
      const result = await usersService.resetPassword({ email, password, otp_id })
      res.status(200).json({ message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS })
    } catch (error) {
      next(error)
    }
  }
}
