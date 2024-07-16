import { Router } from 'express'
import { loginController, registerController, verifyEmailController } from '~/controllers/users.controllers'
import { emailVerifyTokenValidator, loginValidator, registerValidator } from '~/middlewares/users.middlewares'
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
