import { Router } from 'express'
import { getStudentsController } from '~/controllers/admin.controllers'
import { adminValidator, paginationValidator } from '~/middlewares/admin.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

export const adminRouter = Router()

adminRouter.get('/students', adminValidator, paginationValidator, wrapRequestHandler(getStudentsController))
