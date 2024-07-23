import { Router } from 'express'
import { addStudentController, getStudentsController } from '~/controllers/admin.controllers'
import {
  addStudentValidator,
  adminValidator,
  handleRequest,
  paginationValidator
} from '~/middlewares/admin.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
export const adminRouter = Router()

adminRouter.get('/students', adminValidator, paginationValidator, wrapRequestHandler(getStudentsController))

adminRouter.post('/students/add', adminValidator, wrapRequestHandler(addStudentController))
