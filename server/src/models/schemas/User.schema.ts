import { ObjectId } from 'mongodb'
import { RoleType, UserVerifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth?: number
  password: string
  created_at?: number
  updated_at?: number
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  username?: string
  avatar?: string
  cover_photo?: string
  role?: RoleType
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: number
  password: string
  created_at: number
  updated_at: number
  email_verify_token: string // jwt hoặc '' nếu đã xác thực email
  forgot_password_token: string // jwt hoặc '' nếu đã xác thực email
  verify: UserVerifyStatus
  username: string // optional
  avatar: string // optional
  cover_photo: string // optional
  role: RoleType

  constructor(user: UserType) {
    const date = Date.now()
    this._id = user._id
    this.name = user.name || ''
    this.email = user.email
    this.date_of_birth = user.date_of_birth || date
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
    this.role = user.role || RoleType.User
  }
}
