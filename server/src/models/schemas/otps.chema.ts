import { ObjectId } from 'mongodb'
import { RoleType, UserVerifyStatus } from '~/constants/enums'

interface OtpsType {
  _id?: ObjectId
  user_id: ObjectId
  otp: string
  created_at?: Date
  expires_at: Date
}

export default class Otps {
  _id?: ObjectId
  user_id: ObjectId
  otp: string
  created_at: Date
  expires_at: Date

  constructor(otp: OtpsType) {
    const date = new Date()
    this._id = otp._id
    this.user_id = otp.user_id
    this.otp = otp.otp
    this.created_at = otp.created_at || date
    this.expires_at = otp.expires_at || date
  }
}
