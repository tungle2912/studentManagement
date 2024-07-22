import databaseService from './database.services'

class AdminService {
  async getStudents({ limit, page }: { limit: number; page: number }) {
    const students = await databaseService.students
      .find({})
      .sort({ created_at: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()

    const total = await databaseService.students.countDocuments()
    return {
      total,
      students
    }
  }
}
const adminService = new AdminService()
export default adminService
