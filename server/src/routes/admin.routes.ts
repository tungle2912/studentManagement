import { Router } from 'express'
import {
  addStudentController,
  deleteStudentController,
  editStudentController,
  getALLStudentsController,
  getStudentByIdController
} from '~/controllers/admin.controllers'
import {
  addStudentValidator,
  adminValidator,
  handleRequest,
  paginationValidator
} from '~/middlewares/admin.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
export const adminRouter = Router()

adminRouter.get('/students', adminValidator, paginationValidator, wrapRequestHandler(getALLStudentsController))

adminRouter.post(
  '/student/add',
  adminValidator,
  handleRequest,
 // addStudentValidator,
  wrapRequestHandler(addStudentController)
)

adminRouter.get('/student/:studentId', adminValidator, wrapRequestHandler(getStudentByIdController))

adminRouter.put('/student/edit/:studentId', adminValidator, handleRequest, wrapRequestHandler(editStudentController))

adminRouter.delete('/student/delete/:studentId', adminValidator, wrapRequestHandler(deleteStudentController))
