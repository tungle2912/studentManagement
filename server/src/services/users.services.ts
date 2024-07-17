import { RegisterReqBody } from '~/models/requests/User.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import { envConfig } from '~/constants/config'
import nodemailer from 'nodemailer'
import RefreshToken from '~/models/schemas/RefreshToken.chema'
import { USERS_MESSAGES } from '~/constants/messages'

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
  async sendVerificationEmail(userEmail: string, emailVerifyToken: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: envConfig.emailUsername,
        pass: envConfig.emailPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    const verificationLink = `http://localhost:4000/users/verify-email?token=${emailVerifyToken}`

    const mailOptions = {
      from: envConfig.emailUsername,
      to: 'tung291203@gmail.com',
      subject: 'Email Verification',
      html: `<p>Please click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`
    }

    await transporter.sendMail(mailOptions)
  }
  async sendOTPEmail(userEmail: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: envConfig.emailUsername,
        pass: envConfig.emailPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    const mailOptions = {
      from: envConfig.emailUsername,
      to: 'tung291203@gmail.com',
      subject: 'ForgotPassword Verification',
      html: `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification Code</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 10px 0;
                            border-bottom: 1px solid #dddddd;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            color: #333333;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 18px;
                            color: #666666;
                        }
                        .otp {
                            display: inline-block;
                            margin: 20px 0;
                            padding: 10px 20px;
                            font-size: 24px;
                            font-weight: bold;
                            color: #ffffff;
                            background-color: #007BFF;
                            border-radius: 4px;
                            text-decoration: none;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px 0;
                            border-top: 1px solid #dddddd;
                            font-size: 14px;
                            color: #999999;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Email Verification</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Your want to reset your password. Please use the following One Time Password (OTP) to complete your verification process:</p>
                            <div class="otp">${otp}</div>
<p>This OTP is valid for 120s.</p>
                        </div>
                        <div class="footer">
                            <p>If you did not request this code, please ignore this email.</p>
                            <p>Thank you,<br>Your Company Name</p>
                        </div>
                    </div>
                </body>
                </html>`
    }

    await transporter.sendMail(mailOptions)
  }
  async register(payload: RegisterReqBody) {
    try {
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
      await this.sendVerificationEmail(payload.email, email_verify_token)
      return {
        message: 'Please check your email to verify your account.'
      }
    } catch (error) {
      console.error('Error during registration:', error)
      throw new Error('An error occurred during registration. Please try again later.')
    }
  }
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
    return {
      access_token,
      refresh_token
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
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
  async saveOtpDatabase(user_id: string, otp: string) {
    const created_at = new Date()
    const _id = new ObjectId()
    const userId = new ObjectId(user_id)
    const expires_at = new Date(created_at.getTime() + 60 * 1000) // 60 giây
    await databaseService.otps.insertOne({
      _id,
      user_id: userId,
      otp,
      expires_at,
      created_at
    })
  }
  async forgotPasswordService({ user_id, email }: { user_id: string; email: string }) {
    const otp = this.generateOtp()
    await this.sendOTPEmail(email, otp)
    await this.saveOtpDatabase(user_id, otp)
  }
  async verifyOTPAndResetPassword({ email, password, otp }: { email: string; password: string; otp: string }) {
    try {
      const user = await databaseService.users.findOne({ email })
      if (!user) {
        throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
      }
      const otpRecord = await databaseService.otps.findOne({
        user_id: user._id,
        otp
      })
      if (!otpRecord || otpRecord.expires_at < new Date()) {
        throw new Error(USERS_MESSAGES.OTP_INVALID_OR_EXPIRED)
      }
      await databaseService.users.updateOne(
        { _id: user._id }, // Sử dụng _id để tìm kiếm người dùng
        {
          $set: { password: hashPassword(password) },
          $currentDate: {
            updated_at: true //
          }
        }
      )
      // Xóa bản ghi OTP
      await databaseService.otps.deleteOne({ _id: otpRecord._id })
      return {
        message: USERS_MESSAGES.PASSWORD_RESET_SUCCESS
      }
    } catch (error) {
      console.error('Error during verifyOTPAndResetPassword:', error)
      throw new Error('An error occurred during verify OTP and reset password. Please try again later.')
    }
  }
}

const usersService = new UsersService()
export default usersService
