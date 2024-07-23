import { NextFunction, Request, Response } from 'express'
import { result } from 'lodash'
import adminService from '~/services/admin.services'
export const getStudentsController = async (req: Request, res: Response, error: NextFunction) => {
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
  const url = await adminService.uploadImage(req)
  const student = await adminService.addStudent({ req: req, url: url })
  return res.json({
    message: 'Upload image successfully',
    result: student
  })
}
