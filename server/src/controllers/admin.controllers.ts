import { NextFunction, Request, Response } from 'express'
import { result } from 'lodash'
import adminService from '~/services/admin.services'
import { handleUploadImage } from '~/utils/file'
export const getALLStudentsController = async (req: Request, res: Response, error: NextFunction) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await adminService.getStudents({
    limit,
    page
  })

  res.json({
    message: 'Get list of students successfully',
    result: {
      students: result.students,
      limit,
      page,
      total_pages: Math.ceil(result.total / limit)
    }
  })
}
export const addStudentController = async (req: Request, res: Response, next: NextFunction) => {
 // const file = await handleUploadImage(req)
  const url = await adminService.uploadImage(req.files.image[0])
  const student = await adminService.addStudent({ req: req, url: url })
  return res.json({
    message: 'Upload image successfully',
    result: student
  })
}
export const getStudentByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const student = await adminService.getStudentById(req.params.studentId)
  return res.json({
    message: 'Get student by id successfully',
    result: student
  })
}
export const editStudentController = async (req: Request, res: Response, next: NextFunction) => {
  console.log('body1', req.body)
  console.log('params1', req.params)
  console.log('file', req.files)
  let url = ''
  if (Object.keys(req.files).length !== 0) {
    url = await adminService.uploadImage(req.files.image[0])
  }
  console.log('reqbody', req.body)
  const result = await adminService.editStudent({ studentId: req.params.studentId, data: req.body, urlImage: url })
  return res.json({
    message: 'Get student by id successfully',
    result
  })
}
export const deleteStudentController = async (req: Request, res: Response, next: NextFunction) => {
  await adminService.deleteStudent(req.params.studentId)
  return res.json({
    message: 'Delete student successfully'
  })
}