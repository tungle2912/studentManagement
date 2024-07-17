import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  LoginReqBody,
  RegisterReqBody,
  requestOTPReqBody,
  TokenPayload,
  VerifyEmailReqBody,
  verifyOTPAndResetPasswordReqBody
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
    const result = await usersService.register(req.body)
    return res.json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      result
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
      const user = req.user as User
      const user_id = user._id as ObjectId
      await usersService.forgotPasswordService({ user_id: user_id.toString(), email: user.email })
      res.status(200).json({ message: 'OTP sent to your email.' })
    } catch (error) {
      next(error)
    }
  },
  verifyOTPAndResetPassword: async (
    req: Request<ParamsDictionary, any, verifyOTPAndResetPasswordReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password, otp } = req.body
      const result = await usersService.verifyOTPAndResetPassword({ email, password, otp })
      res.status(200).json({ message: 'Password reset successfully.' })
    } catch (error) {
      next(error)
    }
  }
}
