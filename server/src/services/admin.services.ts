import { ObjectId } from 'mongodb'
import Student from '~/models/schemas/student.schema'
import databaseService from './database.services'
import cloudinary from '~/utils/cloudinary'

class AdminService {
  async getStudents({
    limit,
    page,
    search,
    sortBy,
    sortOrder
  }: {
    limit: number
    page: number
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: new RegExp(search, 'i') } },
            { phone: { $regex: new RegExp(search, 'i') } },
            { email: { $regex: new RegExp(search, 'i') } }
          ]
        }
      : {}
    const sortQuery: { [key: string]: 1 | -1 } = {
      [sortBy || 'created_at']: sortOrder === 'ascend' ? 1 : -1
    }
    const students = await databaseService.students
      .find(searchQuery)
      .sort(sortQuery)
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    const total = await databaseService.students.countDocuments(searchQuery)
    return {
      total,
      students
    }
  }

  async uploadImage(file: any) {
    try {
      const result = await cloudinary.uploader.upload(file.filepath)
      return result.secure_url
    } catch (err) {
      throw new Error(`Upload failed`)
    }
  }
  // const newName = getNameFromFullname(file.newFilename)
  // const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
  // await sharp(file.filepath).jpeg().toFile(newPath)
  // try {
  //   fs.unlinkSync(file.filepath);
  // } catch (error) {
  //   console.log('err', error)
  // }

  //  return `${newName}.jpg`
  //}
  async addStudent(data: Student) {
    const newStudent = new Student({
      name: data.name,
      email: data.email,
      phone: data.phone,
      enroll_number: data.enroll_number,
      date_of_admission: data.date_of_admission,
      avatar: data.avatar
    })
    await databaseService.students.insertOne(newStudent)
    return newStudent
  }
  async editStudent({ studentId, data }: { studentId: string; data: Student }) {
    if (data.avatar == '') {
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
            avatar: data.avatar
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
  deleteStudent = async (studentId: string) => {
    try {
      // 1. Tìm kiếm student bằng studentId để lấy avatar URL
      const student = await databaseService.students.findOne({ _id: new ObjectId(studentId) })

      if (!student) {
        throw new Error('Student not found')
      }

      // 2. Trích xuất public_id từ URL của avatar
      const avatarUrl = student.avatar
      const publicId = avatarUrl.split('/').pop()?.split('.')[0]

      // 3. Xóa ảnh khỏi Cloudinary
      if (publicId) {
        await cloudinary.uploader.destroy(publicId)
      }

      // 4. Xóa student khỏi cơ sở dữ liệu
      await databaseService.students.deleteOne({ _id: new ObjectId(studentId) })
    } catch (error) {
      console.error('Error deleting student or image:', error)
      throw error // Quăng lỗi để controller xử lý
    }
  }
}
const adminService = new AdminService()
export default adminService
