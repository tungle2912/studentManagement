import { Router } from 'express'
import {
  addStudentController,
  editStudentController,
  getALLStudentsController,
  getStudentByIdController
} from '~/controllers/admin.controllers'
import { adminValidator, paginationValidator } from '~/middlewares/admin.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
export const adminRouter = Router()

adminRouter.get('/students', adminValidator, paginationValidator, wrapRequestHandler(getALLStudentsController))

adminRouter.post('/student/add', adminValidator, wrapRequestHandler(addStudentController))

adminRouter.get('/student/:studentId', adminValidator, wrapRequestHandler(getStudentByIdController))

adminRouter.put('/student/edit/:studentId', adminValidator, wrapRequestHandler(editStudentController))
