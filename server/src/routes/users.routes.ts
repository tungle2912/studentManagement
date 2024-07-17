import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  registerController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  emailVerifyTokenValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  sendOtpForgotPasswordValidator,
  verifyOtpForgotPasswordValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
export const usersRouter = Router()

/**
 * Description. Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description. user login
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string,access_token: string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description. Verify email when user clinet click on the link in email
 * Path: /verify-email
 * Method: POST
 * body: { email_verify_token: string }
 */
usersRouter.get('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description.submid email to reset password, sen email to user
 * Path: /send-otp-forgot-password
 * Method: POST
 * body: {email: string}
 */
usersRouter.post(
  '/send-otp-forgot-password',
  sendOtpForgotPasswordValidator,
  wrapRequestHandler(forgotPasswordController.requestOTP)
)

/**
 * Description.submid email to reset password, sen email to user
 * Path: /verify-otp-forgot-password
 * Method: POST
 * body: {email: string}
 */
usersRouter.post(
  '/verify-otp-forgot-password',
  verifyOtpForgotPasswordValidator,
  wrapRequestHandler(forgotPasswordController.verifyOTP)
)

/**
 * Description.submid email to reset password, sen email to user
 * Path: /reset-password
 * Method: POST
 * body: {email: string}
 */
usersRouter.put('/reset-password', resetPasswordValidator, wrapRequestHandler(forgotPasswordController.resetPassword))
