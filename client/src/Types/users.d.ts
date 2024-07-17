export interface user {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  username?: string
  avatar?: string
  cover_photo?: string
  role?: RoleType
}
