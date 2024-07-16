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
    await this.sendVerificationEmail(payload.email, email_verify_token)

    return {
      message: 'Please check your email to verify your account.'
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
}

const usersService = new UsersService()
export default usersService
