import { ObjectId } from 'mongodb'

interface IStudent {
  _id?: ObjectId
  user_id?: ObjectId
  name: string
  email: string
  created_at?: number
  updated_at?: number
  phone: string
  enroll_number: string
  date_of_admission: string
  avatar: string
}

export default class Student {
  _id?: ObjectId
  user_id?: ObjectId
  name: string
  email: string
  created_at: number
  updated_at: number
  phone: string
  enroll_number: string
  date_of_admission: string
  avatar: string

  constructor(student: IStudent) {
    const date = Date.now()
    this._id = student._id || new ObjectId()
    this.user_id = student.user_id || new ObjectId()
    this.name = student.name
    this.email = student.email
    this.phone = student.phone
    this.enroll_number = student.enroll_number
    this.date_of_admission = student.date_of_admission
    this.avatar = student.avatar
    this.created_at = student.created_at || date
    this.updated_at = student.updated_at || date
  }
}
