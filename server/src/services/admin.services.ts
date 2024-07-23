import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadImage, processFields } from '~/utils/file'
import databaseService from './database.services'
import Student from '~/models/schemas/student.schema'
import { ObjectId } from 'mongodb'

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
  async uploadImage(req: Request) {
    const file = await handleUploadImage(req)
    const newName = getNameFromFullname(file.newFilename)
    const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
    await sharp(file.filepath).jpeg().toFile(newPath)
    //  fs.promises.unlink(file.filepath)
    return `${newName}.jpg`
  }
  async addStudent({ req, url }: { req: Request; url: string }) {
    const processedFields: Record<string, string> = {}
    for (const [key, value] of Object.entries(req.body)) {
      processedFields[key] = Array.isArray(value) ? value[0] : (value as string)
    }
    const student = processFields(processedFields)
    student.avatar = url
    const newStudent = new Student({
      name: student.name,
      email: student.email,
      phone: student.phone,
      enroll_number: student.enroll_number,
      date_of_admission: student.date_of_admission,
      avatar: student.avatar
    })
    await databaseService.students.insertOne(newStudent)
    return newStudent
  }
}
const adminService = new AdminService()
export default adminService
