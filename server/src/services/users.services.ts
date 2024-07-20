import { ObjectId } from 'mongodb'
import { envConfig } from '~/constants/config'
import { ForgotPasswordVerifyStatus, TokenType, UserVerifyStatus } from '~/constants/enums'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqBody } from '~/models/requests/User.requests'
import Otps from '~/models/schemas/otps.chema'
import RefreshToken from '~/models/schemas/RefreshToken.chema'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.services'
import mailService from './mail.services'

class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: envConfig.jwtSecretAccessToken,
      options: {
        expiresIn: envConfig.accessTokenExpiresIn
      }
    })
  }
  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: envConfig.jwtSecretRefreshToken
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: envConfig.jwtSecretRefreshToken,
      options: {
        expiresIn: envConfig.refreshTokenExpiresIn
      }
    })
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: envConfig.jwtSecretEmailVerifyToken,
      options: {
        expiresIn: envConfig.emailVerifyTokenExpiresIn
      }
    })
  }
  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }
  async checkExpEmailVerifyToken({ user_id, exp }: { user_id: string; exp: number }) {
    setTimeout(async () => {
      const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
      if (user && user.email_verify_token !== '') {
        await databaseService.users.deleteOne({ _id: new ObjectId(user_id) })
        console.log('User deleted due to email verification timeout:', user.email)
      }
    }, exp * 1000)
  }
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.jwtSecretRefreshToken
    })
  }
  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        password: hashPassword(payload.password)
      })
    )
    const [Access_Token, Refresh_Token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    const { iat, exp } = await this.decodeRefreshToken(Refresh_Token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: Refresh_Token, iat, exp })
    )
    await mailService.sendVerificationEmail(payload.email, email_verify_token)
    return {
      message: 'Please check your email to verify your account.'
    }
  }
  async login(user: User) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user._id?.toString() || '',
      verify: user.verify
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user._id), token: refresh_token, iat, exp })
    )
    return {
      access_token,
      refresh_token,
      role: user.role
    }
  }
  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
            updated_at: '$$NOW'
          }
        }
      ])
    ])
    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }
  private generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000)
  }
  async saveOtpDatabase(email: string, otp: string) {
    const _id = new ObjectId()
    const user = await databaseService.users.findOne({ email: email })
    const userId = new ObjectId(user?._id)
    await databaseService.otps.deleteMany({ user_id: userId })
    await databaseService.otps.insertOne(
      new Otps({
        _id,
        user_id: userId,
        otp
      })
    )
    return _id
  }
  async forgotPasswordService(email: string) {
    const otp = this.generateOtp().toString()
    const [otp_id] = await Promise.all([this.saveOtpDatabase(email, otp), mailService.sendOTPEmail(email, otp)])
    return otp_id
  }
  async verifyOtp(otp_id: string) {
    await databaseService.otps.updateOne(
      {
        _id: new ObjectId(otp_id)
      },
      [
        {
          $set: {
            status: ForgotPasswordVerifyStatus.Verified,
            updated_at: '$$NOW'
          }
        }
      ]
    )
  }
  async resetPassword({ email, password, otp_id }: { email: string; password: string; otp_id: string }) {
    const user = await databaseService.users.findOne({ email })
    if (!user) {
      throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
    }
    await databaseService.users.updateOne(
      { _id: user._id }, // Sử dụng _id để tìm kiếm người dùng
      {
        $set: { password: hashPassword(password), updated_at: Date.now() }
      }
    )
    // Xóa bản ghi OTP
    await databaseService.otps.deleteOne({ _id: new ObjectId(otp_id) })
  }
}

const usersService = new UsersService()
export default usersService
