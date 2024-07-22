import { ObjectId } from 'mongodb'

interface IStudent {
  _id?: ObjectId
  user_id?: ObjectId
  name: string
  email: string
  created_at?: number
  updated_at?: number
  phone: string
  enrollNumber: string
  dateOfAdmission: string
  avatar: string
}

export default class Student implements IStudent {
  _id?: ObjectId
  user_id?: ObjectId
  name: string
  email: string
  created_at?: number
  updated_at?: number
  phone: string
  enrollNumber: string
  dateOfAdmission: string
  avatar: string

  constructor(student: IStudent) {
    const date = Date.now()
    this._id = student._id
    this.user_id = student.user_id
    this.name = student.name
    this.email = student.email
    this.phone = student.phone
    this.enrollNumber = student.enrollNumber
    this.dateOfAdmission = student.dateOfAdmission
    this.avatar = student.avatar
    this.created_at = student.created_at || date
    this.updated_at = student.updated_at || date
  }
}
