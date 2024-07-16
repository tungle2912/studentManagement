import { Router } from 'express'
import { loginController } from '~/controllers/users.controllers'
import { adminLoginValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

export const adminRouter = Router()
/**
 * Description. admin login
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string,access_token: string}
 */
adminRouter.post('/login', adminLoginValidator, wrapRequestHandler(loginController))
