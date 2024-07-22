import { NextFunction, Request, Response } from 'express'
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
