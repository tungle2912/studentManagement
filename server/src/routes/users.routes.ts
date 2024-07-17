import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  registerController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  adminLoginValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  verifyForgotPasswordValidator
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
 * Path: /forgot-password
 * Method: POST
 * body: {email: string}
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController.requestOTP))

/**
 * Description.submid email to reset password, sen email to user
 * Path: /verify-forgot-password
 * Method: POST
 * body: {email: string}
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapRequestHandler(forgotPasswordController.verifyOTPAndResetPassword)
)
