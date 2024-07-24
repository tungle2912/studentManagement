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
  async uploadImage(file: any) {
    const newName = getNameFromFullname(file.newFilename)
    const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
    await sharp(file.filepath).jpeg().toFile(newPath)
    // try {
    //   fs.unlinkSync(file.filepath);
    // } catch (error) {
    //   console.log('err', error)
    // }
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
  async editStudent({ studentId, data, urlImage }: { studentId: string; data: Student; urlImage: string }) {
    if (urlImage == '') {
      await databaseService.students.updateOne({ _id: new ObjectId(studentId) }, [
        {
          $set: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            enroll_number: data.enroll_number,
            date_of_admission: data.date_of_admission
          }
        }
      ])
    } else {
      await databaseService.students.updateOne({ _id: new ObjectId(studentId) }, [
        {
          $set: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            enroll_number: data.enroll_number,
            date_of_admission: data.date_of_admission,
            avatar: urlImage
          }
        }
      ])
    }

    // const newStudent = new Student({
    //   name: data.name,
    //   email: data.email,
    //   phone: data.phone,
    //   enroll_number: data.enroll_number,
    //   date_of_admission: data.date_of_admission,
    //   avatar: data.avatar
    // })
    // await databaseService.students.insertOne(newStudent)
    // return newStudent
  }
  async getStudentById(studentId: string) {
    const student = await databaseService.students.findOne({ _id: new ObjectId(studentId) })
    return student
  }
  async deleteStudent(studentId: string) {
    await databaseService.students.deleteOne({ _id: new ObjectId(studentId) })
  }
}
const adminService = new AdminService()
export default adminService
